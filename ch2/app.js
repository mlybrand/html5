(function () {
    'use strict';
    var init = function () {
        var orderForm = document.forms.order,
            saveBtn = document.getElementById('saveOrder'),
            saveBtnClicked = false,
            saveForm = function () {
                if (!('formAction' in document.createElement('input'))) {
                    var formAction = saveBtn.getAttribute('formaction');
                    orderForm.setAttribute('action', formAction);
                }
                saveBtnClicked = true;
            };
        saveBtn.addEventListener('click', saveForm, false);
        var qtyFields = orderForm.quantity,
            totalFields = document.getElementsByClassName('item_total'),
            orderTotalField = document.getElementById('order_total');
        var formatMoney = function (value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
        var calculateTotals = function () {
            var i = 0,
                ln = qtyFields.length,
                itemQty = 0,
                itemPrice = 0.00,
                itemTotal = 0.00,
                itemTotalMoney = '$0.00',
                orderTotal = 0.00,
                orderTotalMoney = '$0.00';
            for(;i<ln;i++) {
                if (!!qtyFields[i].valueAsNumber) {
                    itemQty = qtyFields[i].valueAsNumber || 0;  
                } else {
                    itemQty = parseFloat(qtyFields[i].value) || 0;
                }
                if(!!qtyFields[i].dataSet) {
                    itemPrice = parseFloat(qtyFields[i].dataset.price);
                } else {
                    itemPrice = parseFloat(qtyFields[i].getAttribute('data-price'));
                }
                itemTotal = itemQty * itemPrice;
                itemTotalMoney = '$'+formatMoney(itemTotal.toFixed(2));
                orderTotal += itemTotal;
                orderTotalMoney = '$'+formatMoney(orderTotal.toFixed(2));
                if(!!totalFields[i].value) {
                    totalFields[i].value = itemTotalMoney;
                    orderTotalField.value = orderTotalMoney;
                } else {
                    totalFields[i].innerHTML = itemTotalMoney;
                    orderTotalField.innerHTML = orderTotalMoney;
                }
            }
        };
        calculateTotals();
        var qtyListeners = function () {
            var i = 0,
                ln = qtyFields.length;
            for(;i<ln;i++) {
                qtyFields[i].addEventListener('input', calculateTotals, false);
                qtyFields[i].addEventListener('keyup', calculateTotals, false);
            }
        };
        qtyListeners();
        var doCustomValidity = function(field, msg) {
            if('setCustomValidity' in field) {
                field.setCustomValidity(msg);
            } else {
                field.validationMessage = msg;
            }
        };
        var validateForm = function() {
            doCustomValidity(orderForm.name, '');
            doCustomValidity(orderForm.password, '');
            doCustomValidity(orderForm.confirm_password, '');
            doCustomValidity(orderForm.card_name, '');
            if(orderForm.name.value.length < 4) {
                doCustomValidity(
                    orderForm.name, 'Full Name must be at least 4 characters long.'    
                );
            }
            if(orderForm.password.value.length < 8) {
                doCustomValidity(
                    orderForm.password, 'Password must be at least 8 characters long.'    
                );
            }
            if(orderForm.password.value !== orderForm.confirm_password.value) {
                doCustomValidity(
                    orderForm.confirm_password,
                    'Confirm Password must match Password.'
                );
            }
            if(orderForm.card_name.value.length < 4) {
                doCustomValidity(
                    orderForm.card_name,
                    'Name on Card must be at least 4 characters long.'
                );
            }
        };
        orderForm.addEventListener('input', validateForm, false);
        orderForm.addEventListener('keyup', validateForm, false);
        var styleInvalidForm = function() {
            orderForm.className = 'invalid';
        };
        orderForm.addEventListener('invalid', styleInvalidForm, true);
    };
    window.addEventListener('load', init, false);
}());