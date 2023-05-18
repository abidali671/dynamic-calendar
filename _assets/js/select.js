const GenerateCustomSelect = () => {
  const custom_selects = document.querySelectorAll(".custom-select");

  if (custom_selects.length > 0) {
    custom_selects.forEach((element) => {
      const newItem = document.createElement("div");
      newItem.setAttribute("class", "custom-select-container");
      element.classList.forEach((x) => {
        newItem.classList.add(x + "-container");
      });

      newItem.innerHTML = element.outerHTML;

      if (element.parentNode.classList.contains("custom-select-container")) {
        element.parentNode.innerHTML = element.outerHTML;
      } else {
        element.parentNode.replaceChild(newItem, element);
      }
    });
  }

  var x, i, j, l, ll, selElmnt, a, b, c;
  x = document.getElementsByClassName("custom-select-container");

  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.setAttribute(
        "value",
        (!selElmnt?.options[j]?.disabled && selElmnt?.options[j]?.value) || ""
      );
      c.setAttribute("disabled", selElmnt?.options[j]?.disabled);

      if (!selElmnt?.options[j]?.disabled) {
        c.addEventListener("click", function (e) {
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
        });
      }
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
  function closeAllSelect(elmnt) {
    var x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }

  document.addEventListener("click", closeAllSelect);
};

GenerateCustomSelect();
