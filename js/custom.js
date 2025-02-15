function toggleCheckbox() {
    var lfckv = document.getElementById('menu_checkbox').checked;
    if (lfckv) {
        document.getElementsByClassName('header-desctop__bottom')[0].style.left = '0';
    } else {
        document.getElementsByClassName('header-desctop__bottom')[0].style.left = '-100%';
    }
}

document.getElementById('menu_checkbox').onclick = toggleCheckbox;
