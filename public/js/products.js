const btns = document.getElementsByTagName('button');

const addProductToCart = async (pId) => {
    try {
        const result = await fetch(`http://localhost:8080/api/carts/65a42d08c3a736e56b2c2915/product/${pId}`, {
            body: JSON.stringify({
                quantity: 1
            }),
            method: 'post',
            headers: {
               'Content-Type': 'application/json' 
            }
        });
        if(result){
            alert('Added successfully');
        }
        else{
            alert('Error, could not add');
        }
    } catch (error) {
        alert('Error, could not add');
    }
}

for(let btn of btns){
    btn.addEventListener('click', (event) => {
        addProductToCart(btn.id);
    });
}