sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
 ], function (Controller, UIComponent) {
    "use strict";
 
    return Controller.extend("imropro.controller.ProductDetail", {
       onInit: function () {
          var oRouter = UIComponent.getRouterFor(this);
          
          oRouter.getRoute("productDetail").attachPatternMatched(this._onRouteMatched, this);
       },
 
       _onRouteMatched: function (oEvent) {
          var oArgs = oEvent.getParameter("arguments");
          var sProductId = oArgs.productId-1;
       
          // Fetch product details based on the productId and display them on the second page.
          this._loadProductDetails(sProductId);
       },
 
       _loadProductDetails: function (sProductId) {
        var oView = this.getView();
        var oModel = oView.getModel("products");
        var sPath = "/Products/" + sProductId;
        
        oView.bindElement({
           path: sPath,
           model: "products",
           events: {
              change: this._onBindingChange.bind(this)
           }
        });
       }  ,

     _onBindingChange: function () {
        var oView = this.getView();
        var oElementBinding = oView.getElementBinding("products");

        var oContext = oElementBinding.getBoundContext();
       
        if (oContext) {
           oView.setBindingContext(oContext, "products");
           
        } else {
         
        }
     }
  
    });
 });
 
