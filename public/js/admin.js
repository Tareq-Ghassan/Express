const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    fetch('/admin/product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        return result.json();
    }).then(data => {
        console.log(data);
        btn.closest('article').parentNode.removeChild(btn.closest('article'));
    }).catch(error => {
        console.log(error);
    });
}