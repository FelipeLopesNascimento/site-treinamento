const events = {
  viewProduct: "View_Product",
  addProductList: "Add_Product_List",
  viewProductList: "View_Product_List",
  viewBanner: "View_Banner",
  clickBanner: "Click_Banner",
  addToCart: "Add_Product",
  removeCart: "Remove_Product",
  checkout: "Checkout",
  purchase: "Purchase",
};

const productLists = {
  home: "Home",
  compacto: "Compacto",
  sedan: "Sedan",
  esportivo: "Esportivo",
};

const carModels = {
  p206: {
    product_brand: "Peugeot",
    product_cat: "Compacto",
    product_id: "C01",
    product_name: "Peugeot 206",
    product_price: 18000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  gol: {
    product_brand: "Volkswagen",
    product_cat: "Compacto",
    product_id: "C02",
    product_name: "Gol",
    product_price: 14000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  mx5: {
    product_brand: "Mazda",
    product_cat: "Esportivo",
    product_id: "C03",
    product_name: "MX-5",
    product_price: 25000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  impreza: {
    product_brand: "Subaru",
    product_cat: "Esportivo",
    product_id: "C04",
    product_name: "Impreza",
    product_price: 20000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  fusion: {
    product_brand: "Ford",
    product_cat: "Sedan",
    product_id: "C05",
    product_name: "Fusion",
    product_price: 28000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  charger: {
    product_brand: "Dodge",
    product_cat: "Sedan",
    product_id: "C06",
    product_name: "Charger",
    product_price: 35000,
    product_quantity: "1",
    product_sku: "Alure",
  },
};

localStorage.pixelCart = localStorage.pixelCart || JSON.stringify([]);
localStorage.pixelTransactions = localStorage.pixelTransactions || 0;

var cart = JSON.parse(localStorage.pixelCart);
var transactions = parseInt(localStorage.pixelTransactions);

function dlEvent({
  event,
  listProperties = {},
  itemsList = [],
  itemProperties = {},
  bannerProperties = {},
} = {}) {
  if (event) {
    var ecommerce = {};
    var totalPrice;

    if (itemsList.length == 0) {
      //Inclui o itemProperties dentro do array itemsList
      if (Object.keys(itemProperties).length > 0) {
        itemsList.push(itemProperties);
      }
    }

    if(listProperties.listName){
      ecommerce.list = listProperties.listName;
    }

    if(listProperties.index){
      ecommerce.index = listProperties.index;
    }
    ecommerce.items = itemsList;

    /**
     * As configurações necessárias para os eventos view_product e add_product_list acontecem
     * antes da verificação do nome do evento
     */

    if (event == events.viewProductList) {
      ecommerce.items = getList(listProperties.listName);
    }

    if (event == events.viewBanner || event == events.clickBanner) {
      //TODO: Lógica do evento de visualização e clique de banner
    }

    if (event == events.addToCart) {
      cart.push(itemProperties);

      localStorage.pixelCart = JSON.stringify(cart);

      console.log("------Item adicionado ao carrinho------");
      console.log(cart);
      console.log("---------------------------------------");
    }

    if (event == events.removeCart) {
      cart = removeItem(cart, itemProperties);

      localStorage.pixelCart = JSON.stringify(cart);

      console.log("------Item removido do carrinho------");
      console.log(cart);
      console.log("---------------------------------------");
    }

    if (event == events.checkout) {
      ecommerce.total = getTotalValue(cart);
      ecommerce.items = Array.from(cart);
    }

    if (event == events.purchase) {
      ecommerce.total = getTotalValue(cart);
      ecommerce.items = Array.from(cart);
      ecommerce.transaction = registerTransaction();
    }

    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: event,
      ecommerce: ecommerce,
    });
  }
}

function removeItem(arr, item) {
  for (i in arr) {
    if ((arr[i].product_id = item.product_id)) {
      arr.splice(i, 1);
      break;
    } else if ((i = arr.length - 1)) {
      console.log("Produto não encontrado");
    }
  }

  return arr;
}

function getTotalValue(arr) {
  var total = 0;

  for (i in arr) {
    total += arr[i].product_price;
  }

  return total;
}

function registerTransaction() {
  transactions++;
  cart = [];

  localStorage.pixelTransactions = transactions;
  localStorage.pixelCart = JSON.stringify(cart);

  return (
    "T-PDX" +
    transactions.toLocaleString("pt-BR", {
      minimumIntegerDigits: 4,
    })
  );
}

function getList(listName) {
  var aux = [];

  for (i in carModels) {
    if (carModels[i].product_cat == listName || listName == productLists.home) {
      aux.push(carModels[i]);
    }
  }

  return aux;
}
