sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"

], function (Controller, MessageToast, Dialog, Button, Input, Label, VBox, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("imropro.controller.View1", {

       globalProductId: null,

        onInit: function () {

        },

        onSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oBindingContext = oSelectedItem.getBindingContext("products");
            this.globalProductId = oSelectedItem.getBindingContext("products").getProperty("ProductID");
            this._selectedProductPath = oBindingContext ? oBindingContext.getPath() : null;
        },

        onDeleteProduct: function () {
            if (!this._selectedProductPath) {
                MessageToast.show("Please select a product to delete.");
                return;
            }

            var that = this;

            MessageBox.confirm("Are you sure you want to delete this product?", {
                title: "Confirmation",
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that._deleteProduct();
                    }
                }
            });
        },

        _deleteProduct: function () {
            var oProductsModel = this.getView().getModel("products");
            var aProducts = oProductsModel.getProperty("/Products");
            var iIndex = parseInt(this._selectedProductPath.split("/")[2]);

            aProducts.splice(iIndex, 1);
            oProductsModel.setProperty("/Products", aProducts);

            MessageToast.show("Product deleted!");
        },

        onOpenUpdateDialog: function () {
            if (!this._selectedProductPath) {
                MessageToast.show("Please select a product to update.");
                return;
            }

            var oProductsModel = this.getView().getModel("products");
            var iIndex = parseInt(this._selectedProductPath.split("/")[2]);
            var oSelectedProduct = oProductsModel.getProperty("/Products/" + iIndex);
            var that = this;

            this._createUpdateDialog(oSelectedProduct, that);
        },

        _createUpdateDialog: function (oProduct) {
            // Store a copy of the original product data
            var oOriginalProduct = Object.assign({}, oProduct);

            var oDialog = new Dialog({
                title: 'Update Product',
                type: 'Message',
                content: [
                    new VBox({
                        items: [
                            new Label({ text: 'Product Name' }),
                            new Input({ value: oProduct.ProductName, liveChange: function (oEvent) { oProduct.ProductName = oEvent.getParameter('value'); } }),
                            new Label({ text: 'Unit Price' }),
                            new Input({ value: oProduct.UnitPrice.toString(), liveChange: function (oEvent) { oProduct.UnitPrice = parseFloat(oEvent.getParameter('value')); } }),
                            new Label({ text: 'Supplier ID' }),
                            new Input({ value: oProduct.SupplierID, liveChange: function (oEvent) { oProduct.SupplierID = oEvent.getParameter('value'); } }),
                            new Label({ text: 'Category ID' }),
                            new Input({ value: oProduct.CategoryID.toString(), liveChange: function (oEvent) { oProduct.CategoryID = parseFloat(oEvent.getParameter('value')); } }),
                            new Label({ text: 'Quantity Per Unit' }),
                            new Input({ value: oProduct.QuantityPerUnit, liveChange: function (oEvent) { oProduct.QuantityPerUnit = oEvent.getParameter('value'); } }),
                            new Label({ text: 'Units InStock' }),
                            new Input({ value: oProduct.UnitsInStock.toString(), liveChange: function (oEvent) { oProduct.UnitsInStock = parseFloat(oEvent.getParameter('value')); } }),
                            new Label({ text: 'Units OnOrder' }),
                            new Input({ value: oProduct.UnitsOnOrder, liveChange: function (oEvent) { oProduct.UnitsOnOrder = oEvent.getParameter('value'); } }),
                            new Label({ text: 'Reorder Level' }),
                            new Input({ value: oProduct.ReorderLevel.toString(), liveChange: function (oEvent) { oProduct.ReorderLevel = parseFloat(oEvent.getParameter('value')); } })

                        ]
                    })
                ],
                beginButton: new Button({
                    text: 'Update',
                    press: function () {
                        // this.onUpdateProduct(oProduct);
                        oDialog.close();
                        MessageToast.show("Product Updated");
                    }.bind(this)
                }),
                endButton: new Button({
                    text: 'Cancel',
                    press: function () {
                        // Restore the original data on cancel
                        Object.assign(oProduct, oOriginalProduct);
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        },

        onCreateProduct: function () {
            var oDialog = new Dialog({
                title: 'Add New Product',
                type: 'Message',
                content: [
                    new VBox({
                        items: [
                            new Label({ text: 'Product Name' }),
                            new Input({ id: "newProductName" }),
                            new Label({ text: 'Unit Price' }),
                            new Input({ id: "newProductPrice" }),
                            new Label({ text: 'Supplier ID' }),
                            new Input({ id: "newSupplierID" }),
                            new Label({ text: 'Category ID' }),
                            new Input({ id: "newCategoryID" }),
                            new Label({ text: 'Quantity Per Unit' }),
                            new Input({ id: "newQuantityPerUnit" }),
                            new Label({ text: 'Units InStock' }),
                            new Input({ id: "newUnitsInStock" }),
                            new Label({ text: 'Units OnOrder' }),
                            new Input({ id: "newUnitsOnOrder" }),
                            new Label({ text: 'Reorder Level' }),
                            new Input({ id: "newReorderLevel" })
                        ]
                    })
                ],
                beginButton: new Button({
                    text: 'Add',
                    press: function () {
                        this._addNewProduct();
                        oDialog.close();
                    }.bind(this)
                }),
                endButton: new Button({
                    text: 'Cancel',
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        },

        _addNewProduct: function () {
            var oProductsModel = this.getView().getModel("products");
            var aProducts = oProductsModel.getProperty("/Products");

            var sNewProductName = sap.ui.getCore().byId("newProductName").getValue();
            var sNewProductPrice = sap.ui.getCore().byId("newProductPrice").getValue();
            var sNewSupplierID = sap.ui.getCore().byId("newSupplierID").getValue();
            var sNewCategoryID = sap.ui.getCore().byId("newCategoryID").getValue();
            var sNewQuantityPerUnit = sap.ui.getCore().byId("newQuantityPerUnit").getValue();
            var sNewUnitsInStock = sap.ui.getCore().byId("newUnitsInStock").getValue();
            var sNewUnitsOnOrder = sap.ui.getCore().byId("newUnitsOnOrder").getValue();
            var sNewReorderLevel = sap.ui.getCore().byId("newReorderLevel").getValue();
            var iMaxProductID = 0;
            // aProducts.forEach(function (oProduct){
            //     var iProductId = parseInt(oProduct.ProductID, 10);
            //     if(!isNaN(iProductId) && iProductId > iMaxProductID){
            //         iMaxProductID = iProductId;
            //     }
            // });
            var productIds = aProducts.map(function (oProduct){
                return parseInt(oProduct.ProductID, 10) || 0;
            });
            iMaxProductID = Math.max(...productIds);
            // "ProductID": aProducts.length + 1,
            var oNewProduct = {
                "ProductID": iMaxProductID + 1,
                "ProductName": sNewProductName,
                "SupplierID": sNewSupplierID,
                "CategoryID": sNewCategoryID,
                "QuantityPerUnit": sNewQuantityPerUnit,
                "UnitPrice": parseFloat(sNewProductPrice),
                "UnitsInStock": sNewUnitsInStock,
                "UnitsOnOrder": sNewUnitsOnOrder,
                "ReorderLevel": sNewReorderLevel,
                "Discontinued": false
            };

            aProducts.push(oNewProduct);
            oProductsModel.setProperty("/Products", aProducts);

            MessageToast.show("New product added!");
        },
        onOpenVieweDialog: function (oEvent) {  
        
            if (this.globalProductId == null){ 
                MessageToast.show("Please select a product to display.");
                return;
            }else{    
            this.getOwnerComponent().getRouter().navTo("productDetail", {
                    productId: this.globalProductId
                });
               
            }
            },
        // _createViewDialog: function (oProduct) {

        //     var oDialog = new Dialog({
        //         title: 'Display Product',
        //         type: 'Message',
        //         content: [
        //             new VBox({
        //                 items: [
        //                     new Label({ text: 'Product Name ' }),
        //                     new Input({ value: oProduct.ProductName, enabled: false }),
        //                     new Label({ text: 'Unit Price' }),
        //                     new Input({ value: oProduct.UnitPrice, enabled: false }),
        //                     new Label({ text: 'Supplier ID' }),
        //                     new Input({ value: oProduct.SupplierID, enabled: false }),
        //                     new Label({ text: 'Category ID' }),
        //                     new Input({ value: oProduct.CategoryID, enabled: false }),
        //                     new Label({ text: 'Quantity Per Unit' }),
        //                     new Input({ value: oProduct.QuantityPerUnit, enabled: false }),
        //                     new Label({ text: 'Units InStock' }),
        //                     new Input({ value: oProduct.UnitsInStock, enabled: false }),
        //                     new Label({ text: 'Units OnOrder' }),
        //                     new Input({ value: oProduct.UnitsOnOrder, enabled: false }),
        //                     new Label({ text: 'Reorder Level' }),
        //                     new Input({ value: oProduct.ReorderLevel, enabled: false }),
        //                 ],

        //             })
        //         ],

        //         endButton: new Button({
        //             text: 'Cancel',
        //             press: function () {
        //                 oDialog.close();
        //             }
        //         }),
        //         afterClose: function () {
        //             oDialog.destroy();
        //         }
        //     });

        //     oDialog.open();
        // },
        onSearchProducts: function (oEvent) {
            var sSearchValue = oEvent.getParameter("query").toLowerCase();
            var oTable = this.getView().byId("productTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                var aFilters = [];
                var sDataType = oBinding.oModel.getProperty("/Products/0/ProductName");
                var sOperator = sDataType === "string" ? sap.ui.model.FilterOperator.Contains : sap.ui.model.FilterOperator.EQ;


                if (sSearchValue) {
                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("ProductName", sOperator, sSearchValue),
                            new sap.ui.model.Filter("ProductID", sOperator, sSearchValue),

                        ],
                        and: false
                    });

                    aFilters.push(oFilter);
                }

                oBinding.filter(aFilters);
            }
        },
      
    });
});
