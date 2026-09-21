/* =====================================================
   HABIT FLOW
   Main JavaScript
===================================================== */


/* =====================================================
   1. APPLICATION DATA
===================================================== */

let habits = [];

let selectedCalendarDate = null;

let calendarDate = new Date();


/* =====================================================
   2. GET ELEMENTS
===================================================== */

const habitModal =
    document.getElementById("habitModal");

const habitForm =
    document.getElementById("habitForm");

const habitName =
    document.getElementById("habitName");

const habitCategory =
    document.getElementById("habitCategory");

const habitIcon =
    document.getElementById("habitIcon");

const dashboardHabitList =
    document.getElementById("dashboardHabitList");

const dashboardEmpty =
    document.getElementById("dashboardEmpty");

const allHabitsList =
    document.getElementById("allHabitsList");

const totalHabitsElement =
    document.getElementById("totalHabits");

const completedTodayElement =
    document.getElementById("completedToday");

const currentStreakElement =
    document.getElementById("currentStreak");

const todayProgressElement =
    document.getElementById("todayProgress");

const progressCircle =
    document.getElementById("progressCircle");

const circlePercentage =
    document.getElementById("circlePercentage");

const progressCompleted =
    document.getElementById("progressCompleted");

const progressRemaining =
    document.getElementById("progressRemaining");

const sidebarStreak =
    document.getElementById("sidebarStreak");

const weeklyChart =
    document.getElementById("weeklyChart");

const calendarMonth =
    document.getElementById("calendarMonth");

const calendarDays =
    document.getElementById("calendarDays");

const selectedDateInfo =
    document.getElementById("selectedDateInfo");

const analyticsChart =
    document.getElementById("analyticsChart");

const habitPerformance =
    document.getElementById("habitPerformance");

const achievementsGrid =
    document.getElementById("achievementsGrid");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =====================================================
   3. DATE FUNCTIONS
===================================================== */

function getDateKey(date = new Date()) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getDateFromKey(key) {

    const parts =
        key.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
}


function formatDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}


function getShortDay(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


function getTodayKey() {

    return getDateKey(
        new Date()
    );
}


/* =====================================================
   4. STORAGE
===================================================== */

function saveData() {

    localStorage.setItem(
        "habitFlowData",
        JSON.stringify(habits)
    );
}


function loadData() {

    const savedData =
        localStorage.getItem(
            "habitFlowData"
        );


    if (!savedData) {

        habits = [];

        return;
    }


    try {

        habits =
            JSON.parse(savedData);


        if (!Array.isArray(habits)) {

            habits = [];

        }

    } catch (error) {

        console.error(
            "Could not load saved data:",
            error
        );

        habits = [];

    }
}


/* =====================================================
   5. NAVIGATION
===================================================== */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


navItems.forEach(function(item) {

    item.addEventListener(
        "click",
        function() {

            const section =
                item.dataset.section;

            showSection(section);

        }
    );

});


function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(
        function(section) {

            section.classList.remove(
                "active-section"
            );

        }
    );


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    navItems.forEach(
        function(item) {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                sectionId
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    if (sectionId === "calendar") {

        renderCalendar();

    }


    if (sectionId === "analytics") {

        renderAnalytics();

    }


    if (sectionId === "achievements") {

        renderAchievements();

    }

}


/* =====================================================
   6. SECTION LINKS
===================================================== */

const sectionLinks =
    document.querySelectorAll(
        "[data-section-link]"
    );


sectionLinks.forEach(
    function(link) {

        link.addEventListener(
            "click",
            function() {

                showSection(
                    link.dataset.sectionLink
                );

            }
        );

    }
);


/* =====================================================
   7. MODAL
===================================================== */

function openModal() {

    habitModal.classList.add(
        "show"
    );

    habitName.focus();

}


function closeModal() {

    habitModal.classList.remove(
        "show"
    );

    habitForm.reset();

}


document
    .getElementById("addHabitButton")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("quickAddButton")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("emptyAddButton")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("closeModalButton")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelModalButton")
    .addEventListener(
        "click",
        closeModal
    );


habitModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            habitModal
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   8. CREATE HABIT
===================================================== */

habitForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            habitName.value.trim();


        const category =
            habitCategory.value;


        const icon =
            habitIcon.value;


        if (!name) {

            showToast(
                "Please enter a habit name."
            );

            return;
        }


        const newHabit = {

            id:
                Date.now(),

            name:
                name,

            category:
                category,

            icon:
                icon,

            createdAt:
                getTodayKey(),

            completedDates:
                []

        };


        habits.push(
            newHabit
        );


        saveData();

        closeModal();

        renderAll();

        showToast(
            "Habit created successfully!"
        );

    }
);


/* =====================================================
   9. TOGGLE HABIT
===================================================== */

function toggleHabit(
    habitId,
    dateKey = getTodayKey()
) {

    const habit =
        habits.find(
            function(item) {

                return (
                    item.id ===
                    habitId
                );

            }
        );


    if (!habit) {

        return;

    }


    const index =
        habit.completedDates.indexOf(
            dateKey
        );


    if (index === -1) {

        habit.completedDates.push(
            dateKey
        );

        showToast(
            "Habit completed! 🎉"
        );

    } else {

        habit.completedDates.splice(
            index,
            1
        );

        showToast(
            "Habit marked incomplete."
        );

    }


    saveData();

    renderAll();

}


/* =====================================================
   10. DELETE HABIT
===================================================== */

function deleteHabit(habitId) {

    const habit =
        habits.find(
            function(item) {

                return item.id === habitId;

            }
        );


    if (!habit) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${habit.name}"?`
        );


    if (!confirmed) {

        return;

    }


    habits =
        habits.filter(
            function(item) {

                return (
                    item.id !==
                    habitId
                );

            }
        );


    saveData();

    renderAll();

    showToast(
        "Habit deleted."
    );

}


/* =====================================================
   11. EDIT HABIT
===================================================== */

function editHabit(habitId) {

    const habit =
        habits.find(
            function(item) {

                return item.id === habitId;

            }
        );


    if (!habit) {

        return;

    }


    const newName =
        prompt(
            "Enter the new habit name:",
            habit.name
        );


    if (
        newName === null
    ) {

        return;

    }


    const cleanName =
        newName.trim();


    if (!cleanName) {

        showToast(
            "Habit name cannot be empty."
        );

        return;

    }


    habit.name =
        cleanName;


    saveData();

    renderAll();

    showToast(
        "Habit updated."
    );

}


/* =====================================================
   12. RENDER DASHBOARD HABITS
===================================================== */

function renderDashboardHabits() {

    dashboardHabitList.innerHTML = "";


    if (habits.length === 0) {

        dashboardEmpty.style.display =
            "block";

        return;

    }


    dashboardEmpty.style.display =
        "none";


    const today =
        getTodayKey();


    habits.forEach(
        function(habit) {

            const completed =
                habit.completedDates.includes(
                    today
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "habit-row";


            row.innerHTML = `

                <div class="habit-info">

                    <div class="habit-icon">
                        ${habit.icon}
                    </div>

                    <div>

                        <span class="habit-name">
                            ${escapeHTML(habit.name)}
                        </span>

                        <span class="habit-category">
                            ${escapeHTML(habit.category)}
                        </span>

                    </div>

                </div>

                <button
                    class="habit-check ${
                        completed
                            ? "completed"
                            : ""
                    }"
                    data-id="${habit.id}"
                    title="${
                        completed
                            ? "Mark incomplete"
                            : "Mark complete"
                    }"
                >
                    ${completed ? "✓" : ""}
                </button>

            `;


            const checkButton =
                row.querySelector(
                    ".habit-check"
                );


            checkButton.addEventListener(
                "click",
                function() {

                    toggleHabit(
                        habit.id
                    );

                }
            );


            dashboardHabitList.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   13. RENDER ALL HABITS
===================================================== */

function renderAllHabits() {

    allHabitsList.innerHTML = "";


    if (habits.length === 0) {

        allHabitsList.innerHTML = `

            <div class="card empty-state">

                <div class="empty-icon">
                    🌱
                </div>

                <h3>
                    Your habit list is empty
                </h3>

                <p>
                    Create your first habit to start tracking your progress.
                </p>

                <button
                    class="primary-button"
                    id="habitPageAddButton"
                >
                    Create Habit
                </button>

            </div>

        `;


        document
            .getElementById(
                "habitPageAddButton"
            )
            .addEventListener(
                "click",
                openModal
            );


        return;

    }


    habits.forEach(
        function(habit) {

            const totalDays =
                getDaysSince(
                    habit.createdAt
                );


            const completionCount =
                habit.completedDates.length;


            const rate =
                totalDays > 0
                    ? Math.round(
                        (
                            completionCount /
                            totalDays
                        ) * 100
                    )
                    : 0;


            const streak =
                getHabitCurrentStreak(
                    habit
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "full-habit-card";


            card.innerHTML = `

                <div class="full-habit-top">

                    <div class="habit-info">

                        <div class="habit-icon">
                            ${habit.icon}
                        </div>

                        <div>

                            <div class="full-habit-name">
                                ${escapeHTML(habit.name)}
                            </div>

                            <div class="full-habit-meta">

                                <span class="category-badge">
                                    ${escapeHTML(habit.category)}
                                </span>

                            </div>

                        </div>

                    </div>


                    <div class="full-habit-actions">

                        <button
                            class="small-action edit-action"
                            title="Edit"
                        >
                            ✏️
                        </button>

                        <button
                            class="small-action delete delete-action"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                </div>


                <div class="habit-stats">

                    <div class="habit-stat">

                        <span>
                            Completions
                        </span>

                        <strong>
                            ${completionCount}
                        </strong>

                    </div>


                    <div class="habit-stat">

                        <span>
                            Streak
                        </span>

                        <strong>
                            🔥 ${streak}
                        </strong>

                    </div>


                    <div class="habit-stat">

                        <span>
                            Rate
                        </span>

                        <strong>
                            ${Math.min(rate, 100)}%
                        </strong>

                    </div>

                </div>

            `;


            card
                .querySelector(
                    ".edit-action"
                )
                .addEventListener(
                    "click",
                    function() {

                        editHabit(
                            habit.id
                        );

                    }
                );


            card
                .querySelector(
                    ".delete-action"
                )
                .addEventListener(
                    "click",
                    function() {

                        deleteHabit(
                            habit.id
                        );

                    }
                );


            allHabitsList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   14. STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        habits.length;


    const today =
        getTodayKey();


    let completed =
        0;


    habits.forEach(
        function(habit) {

            if (
                habit.completedDates.includes(
                    today
                )
            ) {

                completed++;

            }

        }
    );


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    const currentStreak =
        calculateOverallStreak();


    totalHabitsElement.textContent =
        total;


    completedTodayElement.textContent =
        completed;


    currentStreakElement.textContent =
        `${currentStreak} day${
            currentStreak === 1
                ? ""
                : "s"
        }`;


    todayProgressElement.textContent =
        `${percentage}%`;


    progressCompleted.textContent =
        completed;


    progressRemaining.textContent =
        Math.max(
            total - completed,
            0
        );


    circlePercentage.textContent =
        `${percentage}%`;


    const degrees =
        (
            percentage /
            100
        ) * 360;


    progressCircle.style.background =
        `conic-gradient(
            var(--primary)
            ${degrees}deg,
            var(--border)
            ${degrees}deg
        )`;


    sidebarStreak.textContent =
        `${currentStreak} day${
            currentStreak === 1
                ? ""
                : "s"
        }`;

}


/* =====================================================
   15. STREAK CALCULATION
===================================================== */

function calculateOverallStreak() {

    if (habits.length === 0) {

        return 0;

    }


    let streak = 0;


    const current =
        new Date();


    for (
        let i = 0;
        i < 3650;
        i++
    ) {

        const checkDate =
            new Date(current);


        checkDate.setDate(
            current.getDate() - i
        );


        const key =
            getDateKey(
                checkDate
            );


        const completed =
            habits.some(
                function(habit) {

                    return habit.completedDates.includes(
                        key
                    );

                }
            );


        if (!completed) {

            break;

        }


        streak++;

    }


    return streak;

}


/* =====================================================
   16. HABIT STREAK
===================================================== */

function getHabitCurrentStreak(habit) {

    let streak = 0;


    const current =
        new Date();


    for (
        let i = 0;
        i < 3650;
        i++
    ) {

        const date =
            new Date(current);


        date.setDate(
            current.getDate() - i
        );


        const key =
            getDateKey(date);


        if (
            habit.completedDates.includes(
                key
            )
        ) {

            streak++;

        } else {

            break;

        }

    }


    return streak;

}


/* =====================================================
   17. BEST STREAK
===================================================== */

function getBestStreak(habit) {

    if (
        habit.completedDates.length === 0
    ) {

        return 0;

    }


    const dates =
        [...habit.completedDates]
            .sort();


    let best = 1;

    let current = 1;


    for (
        let i = 1;
        i < dates.length;
        i++
    ) {

        const previous =
            getDateFromKey(
                dates[i - 1]
            );


        const currentDate =
            getDateFromKey(
                dates[i]
            );


        const difference =
            Math.round(
                (
                    currentDate -
                    previous
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (
            difference === 1
        ) {

            current++;

            best =
                Math.max(
                    best,
                    current
                );

        } else {

            current = 1;

        }

    }


    return best;

}


/* =====================================================
   18. DAYS SINCE CREATION
===================================================== */

function getDaysSince(dateKey) {

    const created =
        getDateFromKey(
            dateKey
        );


    const today =
        new Date();


    created.setHours(
        0,
        0,
        0,
        0
    );


    today.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        Math.floor(
            (
                today -
                created
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        ) + 1;


    return Math.max(
        difference,
        1
    );

}


/* =====================================================
   19. WEEKLY CHART
===================================================== */

function getWeekDates() {

    const today =
        new Date();


    const day =
        today.getDay();


    const monday =
        new Date(today);


    const difference =
        day === 0
            ? 6
            : day - 1;


    monday.setDate(
        today.getDate() -
        difference
    );


    const dates = [];


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(monday);


        date.setDate(
            monday.getDate() + i
        );


        dates.push(date);

    }


    return dates;

}


function getCompletionForDate(
    dateKey
) {

    if (
        habits.length === 0
    ) {

        return 0;

    }


    let completed = 0;


    habits.forEach(
        function(habit) {

            if (
                habit.completedDates.includes(
                    dateKey
                )
            ) {

                completed++;

            }

        }
    );


    return Math.round(
        (
            completed /
            habits.length
        ) * 100
    );

}


function renderWeeklyChart() {

    weeklyChart.innerHTML = "";


    const dates =
        getWeekDates();


    dates.forEach(
        function(date) {

            const key =
                getDateKey(date);


            const percentage =
                getCompletionForDate(
                    key
                );


            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "chart-column";


            column.innerHTML = `

                <span class="chart-value">
                    ${percentage}%
                </span>

                <div class="chart-bar-wrapper">

                    <div
                        class="chart-bar"
                        style="height: ${percentage}%"
                    ></div>

                </div>

                <span class="chart-label">
                    ${getShortDay(date)}
                </span>

            `;


            weeklyChart.appendChild(
                column
            );

        }
    );

}


/* =====================================================
   20. CALENDAR
===================================================== */

function renderCalendar() {

    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    calendarMonth.textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarDays.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    let startingDay =
        firstDay.getDay();


    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    for (
        let i = startingDay - 1;
        i >= 0;
        i--
    ) {

        const dayNumber =
            previousMonthDays - i;


        const date =
            new Date(
                year,
                month - 1,
                dayNumber
            );


        createCalendarDay(
            date,
            true
        );

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        createCalendarDay(
            date,
            false
        );

    }


    const totalCells =
        startingDay +
        daysInMonth;


    const remainingCells =
        totalCells % 7 === 0
            ? 0
            : 7 -
                (
                    totalCells % 7
                );


    for (
        let i = 1;
        i <= remainingCells;
        i++
    ) {

        const date =
            new Date(
                year,
                month + 1,
                i
            );


        createCalendarDay(
            date,
            true
        );

    }

}


function createCalendarDay(
    date,
    otherMonth
) {

    const key =
        getDateKey(date);


    const percentage =
        getCompletionForDate(
            key
        );


    const day =
        document.createElement(
            "div"
        );


    day.className =
        "calendar-day";


    if (otherMonth) {

        day.classList.add(
            "other-month"
        );

    }


    if (
        key ===
        getTodayKey()
    ) {

        day.classList.add(
            "today"
        );

    }


    day.innerHTML = `

        <span class="calendar-number">
            ${date.getDate()}
        </span>

        <div class="calendar-progress">

            <div
                class="calendar-progress-fill"
                style="width: ${percentage}%"
            ></div>

        </div>

    `;


    if (!otherMonth) {

        day.addEventListener(
            "click",
            function() {

                showDateDetails(
                    key
                );

            }
        );

    }


    calendarDays.appendChild(
        day
    );

}


/* =====================================================
   21. CALENDAR NAVIGATION
===================================================== */

document
    .getElementById(
        "previousMonth"
    )
    .addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById(
        "nextMonth"
    )
    .addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


function showDateDetails(
    dateKey
) {

    selectedCalendarDate =
        dateKey;


    const date =
        getDateFromKey(
            dateKey
        );


    let completed = 0;


    habits.forEach(
        function(habit) {

            if (
                habit.completedDates.includes(
                    dateKey
                )
            ) {

                completed++;

            }

        }
    );


    const percentage =
        habits.length === 0
            ? 0
            : Math.round(
                (
                    completed /
                    habits.length
                ) * 100
            );


    selectedDateInfo.innerHTML = `

        <h2>
            ${formatDate(date)}
        </h2>

        <p>
            ${completed}
            of
            ${habits.length}
            habits completed
            —
            ${percentage}% progress.
        </p>

    `;

}


/* =====================================================
   22. ANALYTICS
===================================================== */

function renderAnalytics() {

    let totalCompletions = 0;

    let bestStreak = 0;


    habits.forEach(
        function(habit) {

            totalCompletions +=
                habit.completedDates.length;


            bestStreak =
                Math.max(
                    bestStreak,
                    getBestStreak(habit)
                );

        }
    );


    let totalPossible = 0;


    habits.forEach(
        function(habit) {

            totalPossible +=
                getDaysSince(
                    habit.createdAt
                );

        }
    );


    const overall =
        totalPossible === 0
            ? 0
            : Math.round(
                (
                    totalCompletions /
                    totalPossible
                ) * 100
            );


    document.getElementById(
        "totalCompletions"
    ).textContent =
        totalCompletions;


    document.getElementById(
        "bestStreak"
    ).textContent =
        `${bestStreak} days`;


    document.getElementById(
        "overallCompletion"
    ).textContent =
        `${Math.min(
            overall,
            100
        )}%`;


    renderAnalyticsChart();

    renderHabitPerformance();

}


function renderAnalyticsChart() {

    analyticsChart.innerHTML = "";


    const dates =
        getLastSevenDates();


    dates.forEach(
        function(date) {

            const key =
                getDateKey(date);


            const percentage =
                getCompletionForDate(
                    key
                );


            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "analytics-column";


            column.innerHTML = `

                <div class="analytics-bar-container">

                    <div
                        class="analytics-bar"
                        style="height: ${percentage}%"
                    ></div>

                </div>

                <span>
                    ${date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short"
                        }
                    )}
                </span>

            `;


            analyticsChart.appendChild(
                column
            );

        }
    );

}


function getLastSevenDates() {

    const dates = [];

    const today =
        new Date();


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() - i
        );


        dates.push(date);

    }


    return dates;

}


function renderHabitPerformance() {

    habitPerformance.innerHTML = "";


    if (
        habits.length === 0
    ) {

        habitPerformance.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📊
                </div>

                <p>
                    Add habits to see performance data.
                </p>

            </div>

        `;

        return;

    }


    habits.forEach(
        function(habit) {

            const days =
                getDaysSince(
                    habit.createdAt
                );


            const completions =
                habit.completedDates.length;


            const percentage =
                days === 0
                    ? 0
                    : Math.min(
                        Math.round(
                            (
                                completions /
                                days
                            ) * 100
                        ),
                        100
                    );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "performance-row";


            row.innerHTML = `

                <span class="performance-name">
                    ${escapeHTML(habit.name)}
                </span>

                <div class="performance-bar">

                    <div
                        class="performance-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>

                <span class="performance-percent">
                    ${percentage}%
                </span>

            `;


            habitPerformance.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   23. ACHIEVEMENTS
===================================================== */

function renderAchievements() {

    achievementsGrid.innerHTML = "";


    const totalCompletions =
        habits.reduce(
            function(total, habit) {

                return (
                    total +
                    habit.completedDates.length
                );

            },
            0
        );


    const bestStreak =
        habits.reduce(
            function(best, habit) {

                return Math.max(
                    best,
                    getBestStreak(habit)
                );

            },
            0
        );


    const achievements = [

        {
            icon: "🌱",
            title: "First Step",
            description:
                "Create your first habit.",
            unlocked:
                habits.length >= 1
        },

        {
            icon: "✅",
            title: "First Completion",
            description:
                "Complete a habit for the first time.",
            unlocked:
                totalCompletions >= 1
        },

        {
            icon: "🔥",
            title: "7 Day Streak",
            description:
                "Reach a 7 day streak.",
            unlocked:
                bestStreak >= 7
        },

        {
            icon: "🏆",
            title: "30 Day Streak",
            description:
                "Reach a 30 day streak.",
            unlocked:
                bestStreak >= 30
        },

        {
            icon: "💯",
            title: "100 Completions",
            description:
                "Complete habits 100 times.",
            unlocked:
                totalCompletions >= 100
        },

        {
            icon: "🚀",
            title: "Consistency Master",
            description:
                "Reach a 100 day streak.",
            unlocked:
                bestStreak >= 100
        }

    ];


    achievements.forEach(
        function(achievement) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "achievement";


            if (
                !achievement.unlocked
            ) {

                card.classList.add(
                    "locked"
                );

            }


            card.innerHTML = `

                <div class="achievement-icon">
                    ${achievement.icon}
                </div>

                <h3>
                    ${achievement.title}
                </h3>

                <p>
                    ${achievement.description}
                </p>

            `;


            achievementsGrid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   24. THEME
===================================================== */

function setTheme() {

    const savedTheme =
        localStorage.getItem(
            "habitFlowTheme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }

}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "habitFlowTheme",
        isDark
            ? "dark"
            : "light"
    );


    showToast(
        isDark
            ? "Dark mode enabled."
            : "Light mode enabled."
    );

}


document
    .getElementById(
        "themeButton"
    )
    .addEventListener(
        "click",
        toggleTheme
    );


document
    .getElementById(
        "settingsThemeButton"
    )
    .addEventListener(
        "click",
        toggleTheme
    );


/* =====================================================
   25. EXPORT DATA
===================================================== */

document
    .getElementById(
        "exportButton"
    )
    .addEventListener(
        "click",
        function() {

            const data =
                JSON.stringify(
                    habits,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [data],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "habit-flow-data.json";


            link.click();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Your data was exported."
            );

        }
    );


/* =====================================================
   26. RESET DATA
===================================================== */

document
    .getElementById(
        "resetButton"
    )
    .addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(
                    "This will delete ALL habits and progress. Continue?"
                );


            if (!confirmed) {

                return;

            }


            habits = [];


            saveData();

            renderAll();

            showToast(
                "All data has been reset."
            );

        }
    );


/* =====================================================
   27. NOTIFICATION BUTTON
===================================================== */

document
    .getElementById(
        "notificationButton"
    )
    .addEventListener(
        "click",
        function() {

            showToast(
                "You're doing great! Keep going. 🔥"
            );

        }
    );


/* =====================================================
   28. TOAST
===================================================== */

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   29. SECURITY HELPER
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================================
   30. RENDER EVERYTHING
===================================================== */

function renderAll() {

    renderDashboardHabits();

    renderAllHabits();

    updateStatistics();

    renderWeeklyChart();

    renderCalendar();

    renderAnalytics();

    renderAchievements();

}


/* =====================================================
   31. WELCOME DATE
===================================================== */

function updateWelcomeDate() {

    const element =
        document.getElementById(
            "welcomeDate"
        );


    element.textContent =
        formatDate(
            new Date()
        );

}


/* =====================================================
   32. START APPLICATION
===================================================== */

loadData();

setTheme();

updateWelcomeDate();

renderAll();