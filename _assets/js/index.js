const full_calendar = document.querySelectorAll(".section--full-calendar");
let date_list_select = [];
let date_list = [];
let month_list = [];
let year_list = [];
const updateElementsList = () => {
  full_calendar.forEach((element) => {
    date_list.push(element.querySelector(".full-calendar__list"));
    date_list_select.push(element.querySelector(".full-calendar__list-select"));
    month_list.push(element.querySelector("header .calendar-nav"));
    year_list.push(element.querySelector("footer .calendar-nav"));
  });
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months_list = [
  { id: 1, label: "january", totalDays: 31 },
  { id: 2, label: "february", totalDays: 29 },
  { id: 3, label: "march", totalDays: 31 },
  { id: 4, label: "april", totalDays: 30 },
  { id: 5, label: "may", totalDays: 31 },
  { id: 6, label: "june", totalDays: 30 },
  { id: 7, label: "july", totalDays: 31 },
  { id: 8, label: "august", totalDays: 31 },
  { id: 9, label: "september", totalDays: 30 },
  { id: 10, label: "october", totalDays: 31 },
  { id: 11, label: "november", totalDays: 30 },
  { id: 12, label: "december", totalDays: 31 },
];

let pathname = window.location.pathname;

pathname = pathname.replace("/today", "");

let pathname_list = pathname.split("/").filter((value) => value);
pathname_list = pathname_list.map((value) => value.replace(".php", ""));

const date_index = pathname_list.indexOf("date");
let date_list_items = [];
let date_list_select_items = [];
let month_list_items = [];
let year_list_items = [];

let selected_year = pathname_list[date_index + 1];
let next_year = +selected_year + 1;
let prev_year = selected_year - 1;

let selected_month = pathname.includes("today")
  ? months_list[new Date().getMonth()]
  : months_list.find(
      (month) => month.label === (pathname_list[date_index + 2] || "june")
    );

let prev_month = months_list[months_list.indexOf(selected_month) - 1];
let next_month = months_list[months_list.indexOf(selected_month) + 1];

// Function to fetch Dates from API
const fetchDates = async () => {
  try {
    const response = await fetch(
      `https://www.onthisday.com/_assets/cal.php?year=${selected_year}&month=${selected_month.id}`
    );
    let result = await response.json();
    let total_days = selected_month.totalDays;

    result = new Array(total_days).fill(1).map((_, index) => {
      let noLinkItem = {
        i: index + 1,
        w: daysOfWeek[
          new Date(selected_year, selected_month.id, index + 1).getDay()
        ].charAt(0),
      };

      let linkItem = result.find(({ i }) => i == index + 1);
      if (linkItem) linkItem.l = "/history/date/" + linkItem.l;

      return linkItem || noLinkItem;
    });

    updateElementsList();
    handleCreateDayList(result);
    handleCreateMonthList(true);
    handleCreateYearList();
    GenerateCustomSelect();
    handleSelectChangeDate();
  } catch (error) {
    console.log("error==>", error.message);
  }
};
// Function to Create Static Dates
const createDates = () => {
  let newpath = `/${pathname_list[0]}/${selected_month.label}`;

  const day_list = Array(selected_month.totalDays)
    .fill(1)
    .map((_, index) => ({
      i: index + 1,
      l: newpath + "/" + (index + 1),
    }));

  updateElementsList();
  handleCreateMonthList(false);
  handleCreateDayList(day_list);
  GenerateCustomSelect();
  handleSelectChangeDate();
};

// Function to create Day list
const handleCreateDayList = (result) => {
  date_list_items = [];
  date_list_select_items = [`<option>All Days</option>`];

  result.forEach((item) => {
    const day_element =
      item.i == pathname_list[pathname_list.length - 1]
        ? `<li class="full-calendar__item">
          ${
            item.w
              ? `<b>
            <span class="day">${item.w}</span>
          </b>`
              : ""
          }
          <b>
            ${item.i}
          </b>
        </li>`
        : item?.l
        ? `
    <li class="full-calendar__item">
      <a href="${item.l}">
    ${item.w ? `<span class="day">${item.w}</span>` : ""}
        ${item.i}
      </a>
    </li>
 `
        : `
      <li class="full-calendar__item">
        ${
          item.w
            ? `<b>
              <span class="day">${item.w}</span>
            </b>`
            : ""
        }
        ${item.i}
      </li>
      `;

    date_list_items.push(day_element);
  });

  result.forEach((item) => {
    const day_element = item?.l
      ? `
      <option value='${item.l || ""}'>
        ${item.i}
      </option>
 `
      : `
      <option disabled>
        ${item.i}
      </option>
      `;

    date_list_select_items.push(day_element);
  });

  date_list.forEach((element) => (element.innerHTML = date_list_items));

  date_list_select.forEach((element) => {
    element.innerHTML = date_list_select_items;
  });
};

// Function to create month button
const handleCreateMonthList = (isDynamicDate) => {
  let monthToggleElements = [];
  month_list_items = [];
  [prev_month, selected_month, next_month].forEach((value, index) => {
    const month_element = month_year_toggler_element({
      index,
      label: value.label,
    });

    month_list_items.push(month_element);
  });

  month_list.forEach((element) => {
    element.innerHTML = month_list_items;

    monthToggleElements = [
      ...monthToggleElements,
      ...element.querySelectorAll("li.calendar-nav__item a.calendar-nav__link"),
    ];
  });
  handleAddEventOnMonths(monthToggleElements, isDynamicDate);
};

// Function to create year button
const handleCreateYearList = () => {
  let yearToggleElements = [];
  year_list_items = [];
  [prev_year, selected_year, next_year].forEach((value, index) => {
    const year_element = month_year_toggler_element({
      index,
      label: value,
    });

    year_list_items.push(year_element);
  });

  year_list.forEach((element) => {
    element.innerHTML = year_list_items;
    yearToggleElements = [
      ...yearToggleElements,
      ...element.querySelectorAll("li.calendar-nav__item a.calendar-nav__link"),
    ];
  });

  handleAddEventOnYears(yearToggleElements);
};

// Function to add click event on year buttons
const handleAddEventOnYears = (elements) => {
  elements.forEach(async (element, index) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      selected_year = element.className.includes("calendar-nav__link--left")
        ? prev_year
        : element.className.includes("calendar-nav__link--right")
        ? next_year
        : selected_year;

      prev_year = selected_year - 1;
      next_year = +selected_year + 1;

      pathname_list.find((name) => name === "date") && fetchDates();
    });
  });
};

// Function to add click event on month buttons
const handleAddEventOnMonths = (elements, isDynamicDate) => {
  elements.forEach(async (element, index) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();

      selected_month = element.className.includes("calendar-nav__link--left")
        ? prev_month
        : element.className.includes("calendar-nav__link--right")
        ? next_month
        : selected_month;

      prev_month =
        months_list[
          (selected_month.id == 1
            ? 11
            : months_list.indexOf(selected_month) - 1) % 12
        ];

      next_month = months_list[(months_list.indexOf(selected_month) + 1) % 12];

      isDynamicDate ? fetchDates() : createDates();
    });
  });
};

// Next, Prev & Current month & Year Button
const month_year_toggler_element = ({ label, index }) => `
<li class="calendar-nav__item">
  <a
    href='#'
    class="calendar-nav__link ${
      index === 0
        ? "calendar-nav__link--left"
        : index === 2
        ? "calendar-nav__link--right"
        : ""
    }"
  >
    ${label}
  </a>
</li>`;

// It will check the condition, if pathname have date key then the calendar date api will fetch
if (pathname_list.find((name) => name === "date")) {
  fetchDates();
} else {
  createDates();
}

const handleSelectChangeDate = () => {
  const calendars = document.querySelectorAll(".section--full-calendar");

  calendars.forEach((calendar) => {
    calendar
      .querySelector(".custom-select-container .select-items")
      .querySelectorAll("div")
      .forEach((option) => {
        option.addEventListener("click", (e) => {
          if (option.getAttribute("value"))
            window.location.pathname = option.getAttribute("value");
        });
      });
  });
};
