
function showSection(sectionId) {
    // Hide all sections
    document.getElementById('Homepg').style.display = 'none';
    document.getElementById('Colpg').style.display = 'none';
    document.getElementById('Loginpg').style.display = 'none';
    document.getElementById('Cartpg').style.display = 'none';
    document.getElementById('expandedPg').style.display = 'none'; 
    document.getElementById('Checkoutpg').style.display = 'none';
    document.getElementById('Searchpg').style.display = 'none'; 
     document.getElementById('Orderpg').style.display = 'none';
    // Show the selected section
    if (sectionId == 'Homepg') {
        document.getElementById('Homepg').style.display = 'block';
        if (document.getElementById('products')) {
            document.getElementById('products').style.display = "none";
        }
           document.getElementById("categories").style.display = "none";
        document.getElementById("expandedPg").style.display = "none";
    } else if (sectionId == 'Colpg') {
        document.getElementById('Colpg').style.display = 'grid';
        document.getElementById("expandedPg").style.display = "none";
         document.getElementById("categories").style.display = "none";
        
    } else if (sectionId == 'Loginpg') {
        document.getElementById('Loginpg').style.display = 'block';
        if (document.getElementById('loginButton')) {
            document.getElementById('loginButton').style.display = 'none';
        }
        if (document.getElementById('products')) {
            document.getElementById('products').style.display = "none";
        }
        document.getElementById("expandedPg").style.display = "none";
    }
    else if (sectionId == 'Cartpg') {
        loadCartPageContent();
        document.getElementById('Cartpg').style.display = 'block';
        if (document.getElementById('products')) {
            document.getElementById('products').style.display = "none";
        }
        document.getElementById("expandedPg").style.display = "none";
    }
    else if (sectionId == 'Checkoutpg') {
                    console.log(isUserLoggedIn);
                    if (isUserLoggedIn === true) {
                        document.getElementById('Checkoutpg').style.display = 'block';
                        if (document.getElementById('products')) {
                            document.getElementById('products').style.display = "none";
                        }
                        document.getElementById("expandedPg").style.display = "none";
                        
                        let subCheckout = document.getElementById('subtotal').innerHTML;
                        document.getElementById('subCheckout').innerHTML = `$${subCheckout}`;
                        
                        let totalCheckout = (parseFloat(subCheckout) + 5).toFixed(2);
                        document.getElementById('totalCheckout').innerHTML = `$${totalCheckout}`;

                    
                    } else {
                        document.getElementById('Loginpg').style.display = 'block';
                    }
    }
     else if (sectionId == 'Searchpg') {
        document.getElementById('Searchpg').style.display = 'block';
        document.getElementById('searchContainer').style.display = 'grid';
    }
       else if (sectionId == 'Orderpg') {
        document.getElementById('Orderpg').style.display = 'block';
        cart=[]
    }
}


function switchToSignUp() {
    document.getElementById('log').style.display = 'none';
    document.getElementById('signUp').style.display = 'block';
    document.getElementById('forgot').style.display = 'none';
}

function switchToLogin() {
    document.getElementById('log').style.display = 'block';
    document.getElementById('signUp').style.display = 'none';
    document.getElementById('forgot').style.display = 'none';
}
function forgotPassword() {
      document.getElementById('log').style.display = 'none';
    document.getElementById('signUp').style.display = 'none';
    document.getElementById('forgot').style.display = 'block';

}
// Show the Homepg section by default
showSection('Homepg')