$(function () {
    const navbarToggle = $("#navbarToggle");
    const collapsableNav = $("#collapsable-nav");
    navbarToggle.on("blur", () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        collapsableNav.collapse('hide');
      }
    });
  });
  
  (function (global) {
    const dc = {};
    const homeHtmlUrl = "home-snipet.html";
    const categoryHtmlUrl = "category-snippet.html";
    const allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
    const randomCategoryUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    
    function showLoading(selector) {
      const html = "<div class='text-center'>";
      html += "<img src='images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
    }
    
    function insertHtml(selector, html) {
      const target = document.querySelector(selector);
      target.innerHTML = html;
    }
    
    function insertProperty(string, propName, propValue) {
      const propToReplace = `{{${propName}}}`;
      string = string.replace(new RegExp(propToReplace, "g"), propValue);
      return string;
    }
    
    function chooseRandomCategory(categories) {
        const randomArrayIndex = Math.floor(Math.random() * categories.length);
        return categories[randomArrayIndex];
      }
      
      const categories = ['Sushi', 'Lunch', 'Dinner'];
      const chosenCategory = chooseRandomCategory(categories);
      
      console.log(`A random category chosen is: ${chosenCategory}`);
      
    function buildAndShowHomeHTML(categories) {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(allCategoriesUrl, responseText => {
        const chosenCategory = chooseRandomCategory(JSON.parse(responseText));
        let homeHtml = null;
        $ajaxUtils.sendGetRequest(homeHtmlUrl, responseText => {
          homeHtml = responseText;
          const randomCategoryShortName = chosenCategory.short_name;
          const homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", randomCategoryShortName);
          insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
          $("#specials-btn").attr("href", `menu-items.html?category=${randomCategoryShortName}`);
        });
      }, true);
    
      $("#especiais-btn").on("click", () => {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(randomCategoryUrl, responseText => {
          const category = JSON.parse(responseText).category;
          $ajaxUtils.sendGetRequest(categoryHtmlUrl, responseText => {
            let finalHtml = responseText;
            finalHtml = insertProperty(finalHtml, "name", category.name);
            finalHtml = insertProperty(finalHtml, "specialTitle", category.special_title);
            finalHtml = insertProperty(finalHtml, "title", `${category.name} Menu`);
            finalHtml = insertProperty(finalHtml, "id", category.short_name);
            insertHtml("#main-content", finalHtml);
          }, false);
        }, true);
      });
    }
    
    function buildAndShowCategoriesHTML(categories) {
      const categoriesList = document.querySelector("#categories-list");
      let html = "<h2 class='title'>Categorias</h2>";
      for (let i = 0; i < categories.length; i++) {
        html += "<a class='list-group-item list-group-item-action' href='menu-items.html?category=" + categories[i].short_name + "'>" + categories[i].name + "</a>";
      }
      categoriesList.innerHTML = html;
    }
    
    function buildAndShowMenuItemsHTML(categoryShort) {
        showLoading("#main-content");
        const menuItemsUrl = https://davids-restaurant.herokuapp.com/menu_items.json?category=${categoryShort};
        $ajaxUtils.sendGetRequest(menuItemsUrl, responseText => {
        const menuItems = JSON.parse(responseText).menu_items;
        $ajaxUtils.sendGetRequest(categoryHtmlUrl, responseText => {
        let finalHtml = responseText;
        finalHtml = insertProperty(finalHtml, "name", menuItems[0].category_name);
        finalHtml = insertProperty(finalHtml, "specialTitle", "");
        finalHtml = insertProperty(finalHtml, "title", ${menuItems[0].category_name} Menu);
        finalHtml = insertProperty(finalHtml, "id", categoryShort);
        finalHtml = buildMenuItemsViewHtml(menuItems, finalHtml);
        insertHtml("#main-content", finalHtml);
        }, false);
        });
        }
        
        function buildMenuItemsViewHtml(menuItems, categoryHtml) {
        let finalHtml = categoryHtml;
        finalHtml = insertProperty(finalHtml, "name", menuItems[0].category_name);
        finalHtml = insertProperty(finalHtml, "specialTitle", "");
        finalHtml = insertProperty(finalHtml, "id", menuItems[0].category_short_name);
        let menuItemHtml = "";
        for (let i = 0; i < menuItems.length; i++) {
        menuItemHtml += "<div class='row menu-item'>";
        menuItemHtml += "<div class='col-12'>";
        menuItemHtml += "<div class='row'>";
        menuItemHtml += <div class='col-9'><h4>${menuItems[i].name}</h4></div>;
        menuItemHtml += <div class='col-3 text-right'><h4 class='price'>${formatPrice(menuItems[i].price_small)}</h4></div>;
        menuItemHtml += "</div>";
        menuItemHtml += "<div class='row'><div class='col-12'><p>${menuItems[i].description}</p></div></div>";
        menuItemHtml += "</div></div>";
        }
        finalHtml = insertProperty(finalHtml, "menuItems", menuItemHtml);
        return finalHtml;
        }
        
        function formatPrice(price) {
        return "$" + price.toFixed(2);
        }
        
        function init() {
        $ajaxUtils.sendGetRequest(allCategoriesUrl, responseText => {
        const categories = JSON.parse(responseText).categories;
        buildAndShowHomeHTML(categories);
        buildAndShowCategoriesHTML(categories);
        });
        }
        
        init();

function buildAndShowMenuItemsHTML(categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(`https://davids-restaurant.herokuapp.com/menu_items.json?category=${categoryShort}`, responseText => {
    let finalHtml = "<h2 class='title'>Itens do Menu</h2>";
    const menuItems = JSON.parse(responseText).menu_items;
    if (menuItems.length === 0) {
      finalHtml += "<p>Nenhum item encontrado para a categoria selecionada.</p>";
    } else {
      finalHtml += "<div class='row'>";
      for (let i = 0; i < menuItems.length; i++) {
        const menuItem = menuItems[i];
        finalHtml += "<div class='col-lg-6 menu-item'>";
        finalHtml += `<div class="row"><div class="col-3"><img src="${menuItem.image_url}" class="img-fluid"></div>`;
        finalHtml += `<div class="col-9"><h3 class='name'>${menuItem.name}</h3>`;
        finalHtml += `<p class='description'>${menuItem.description}</p>`;
        finalHtml += `<h4 class='price'>${menuItem.price}</h4></div></div></div>`;
      }
      finalHtml += "</div>";
    }
    insertHtml("#main-content", finalHtml);
  }, true);
}

dc.loadMenuCategories = () => {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(allCategoriesUrl, responseText => {
    const categories = JSON.parse(responseText);
    buildAndShowCategoriesHTML(categories);
  }, true);
};

dc.loadMenuItems = categoryShort => buildAndShowMenuItemsHTML(categoryShort);

function initializeMainContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryShort = urlParams.get("category");
  if (categoryShort) {
    buildAndShowMenuItemsHTML(categoryShort);
  } else {
    buildAndShowHomeHTML();
  }
}

global.$dc = dc;
$(window).on("load", initializeMainContent);
})(window);
