// ====== Xử lý chọn phương thức thanh toán ======
var paymentCards = document.querySelectorAll(".payment_card");

paymentCards.forEach(function(card) {
    card.addEventListener("click", function () {

        var active = document.querySelector(".payment_card.card_active");
        if (active) {
            active.classList.remove("card_active");
            active.children[0].classList.remove("header_active");

            const clickedIcon = active.querySelector(".icon_clicked");
            if (clickedIcon) clickedIcon.remove();
        }

        this.classList.add("card_active");
        this.children[0].classList.add("header_active");

        if (!this.querySelector(".icon_clicked")) {
            const icon = document.createElement("div");
            icon.classList.add("icon_clicked");
            icon.innerHTML =
              '<span class="material-symbols-outlined">check_small</span>';
            this.appendChild(icon);
        }

        // cập nhật PaymentID ẩn
        var input = document.getElementById("PaymentID");
        input.value = this.getAttribute("data-id");
    });
});



// ====== Xử lý mã giảm giá (nếu có) ======
var voucherButton = document.querySelector(".submit_button");

if (voucherButton) {
    voucherButton.addEventListener("click", function () {
        var input = document.getElementById("voucher_input");
        var voucherID = input.value.trim();
        var inform = document.getElementById("voucher_discount");
        var discountLabel = document.getElementById("discount");

        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var s = String(this.responseText);

                if (s == 0) {
                    inform.innerText = "*Voucher không hợp lệ hoặc hết hạn!";
                    return;
                }

                var voucher = s.split(",");
                var label = document.getElementById("voucher_name_container");

                label.innerHTML =
                    '<label class="voucher_label">' + voucher[0] + "</label>" +
                    '<span class="material-symbols-outlined" onclick="delete_Voucher(this);">close</span>';

                var inputVoucher = document.getElementById("VoucherID");
                var inputDiscount = document.getElementById("OrderDiscount");
                inputVoucher.value = voucherID;

                var eleTotal = document.getElementsByClassName("payment_detail_pricetotal");

                if (voucher[2] == "%") {
                    inform.innerText = "-" + voucher[1] + " %";
                    var value = (parseInt(eleTotal[0].dataset.total) * parseInt(voucher[1])) / 100;

                    discountLabel.innerText = "- " + value.toLocaleString("en-US") + " $";
                    eleTotal[2].setAttribute("data-total", value);
                    inputDiscount.value = value;
                } else {
                    inform.innerText = "-" + Number(voucher[1]).toLocaleString("en-US") + " $";
                    discountLabel.innerText = "-" + Number(voucher[1]).toLocaleString("en-US") + " $";
                    eleTotal[2].setAttribute("data-total", voucher[1]);
                    inputDiscount.value = voucher[1];
                }

                load_total();
            }
        };
        xml.open("GET", "modules/checkVoucher.php?VoucherID=" + voucherID, true);
        xml.send();
    });
}



// ====== Xóa voucher ======
function delete_Voucher(element) {
    var container = element.parentElement;
    container.innerHTML = "";

    var discountLabel = document.getElementById("discount");
    discountLabel.innerText = "$ - 0";

    var inform = document.getElementById("voucher_discount");
    inform.innerText = "";

    document.getElementsByClassName("payment_detail_pricetotal")[2].dataset.total = 0;

    document.getElementById("VoucherID").value = "NULL";
    document.getElementById("OrderDiscount").value = 0;

    load_total();
}



// ======= Tính phí giao hàng =======
const deliveryCards = document.querySelectorAll(".delivery_card");
const deliveryFeeDisplay = document.getElementById("deliveryfee");
const discountDisplay = document.getElementById("discount");
const totalDisplay = document.getElementById("totalPrice");
const hiddenShippingFee = document.getElementById("ShippingFee");
const hiddenTotal = document.getElementById("Total");
const sumElement = document.getElementById("sum");
const sum = parseFloat(sumElement.dataset.sum);

let currentFee = 0;
let discountValue = 0;

// ======= Cập nhật tổng =======
function updateTotal() {
    const total = sum + currentFee - discountValue;
    totalDisplay.textContent = total.toLocaleString("vi-VN") + " $";
    hiddenTotal.value = total;
}


// ======= Chọn phương thức giao hàng =======
deliveryCards.forEach(card => {
    card.addEventListener("click", () => {

        deliveryCards.forEach(c => c.classList.remove("card_active"));

        card.classList.add("card_active");

        const fee = parseInt(card.dataset.deliveryfee);
        currentFee = fee;

        deliveryFeeDisplay.textContent = fee.toLocaleString("vi-VN") + " $";
        hiddenShippingFee.value = fee;

        updateTotal();
    });
});


// ======= Khởi động lần đầu =======
window.addEventListener("DOMContentLoaded", () => {
    const activeCard = document.querySelector(".delivery_card.card_active");
    if (activeCard) {
        currentFee = parseFloat(activeCard.dataset.deliveryfee);
        deliveryFeeDisplay.textContent = currentFee.toLocaleString("vi-VN") + " $";
        hiddenShippingFee.value = currentFee;
        updateTotal();
    }
});
