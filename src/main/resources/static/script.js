// Function to load content from an HTML file based on the clicked tab

function loadContent(tab) {
    const mainContent = document.querySelector('.main-content');
    let fileName = '';
    switch(tab) {
        case 'Dashboard':
            fileName = 'dashboard.html';
            setTimeout(initializeDashboardTab,1000);
            break;
        case 'Products':
            fileName = 'products.html';
            setTimeout(initializeProductTab, 100);
            break;
        case 'Sales':
            fileName = 'sales.html';
            setTimeout(initializeSalesTab,100)
            break;
        case 'Users':
            fileName = 'users.html';
            setTimeout(initializeUsersTab,100);
            break;
        case 'Reports':
            fileName = 'reports.html';
            setTimeout(initializeReportsTab,100);
            break;
        default:
            mainContent.innerHTML = '<h2>Welcome</h2><p>Select a tab to view content.</p>';
            return;
    }

    fetch(fileName)
    .then(response => response.text())
    .then(html => {
        mainContent.innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading content:', error);
        mainContent.innerHTML = `<p>Error loading ${tab} content</p>`;
    });
}

// Add event listeners to nav items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const tabName = item.textContent.trim();
        loadContent(tabName);
    });
});

// Call loadContent with 'Dashboard' to set it as default
loadContent('Dashboard');

function initializeProductTab(){


    fetch("/api/categories")
    .then(res => res.json()) 
    .then(categories => {
        populateCategoryDropdown(categories); 
    })
    .catch(error => console.error("Error fetching categories:", error));

    function save_categories() {
        const categoryData = {
            name: document.getElementById("groupName").value,
            description: document.getElementById("group-description").value,
        };
    
        fetch("/api/categories", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(categoryData)  
        })
        .then(res => res.json()) 
        .then(data => {        })
        .catch(error => {
            console.error("Error saving category:", error);
        });
    }
    


    function populateCategoryDropdown(categories) {
        const categorySelect = document.getElementById('category');
        
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            option.setAttribute("data-description", category.description);
            option.setAttribute("data-created-at", category.createdAt);
            option.setAttribute("data-category", category.category_id);
            categorySelect.appendChild(option);
        });
    }


    const style = document.createElement('style');
    style.textContent = `
        select.form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            transition: border-color 0.2s ease;
            background-color: white;
            cursor: pointer;
        }

        select.form-control:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        select.form-control option {
            padding: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    async function saveProduct(data) {
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    }

    async function fetchProducts() {
        try {
            const response = await fetch("/api/products");
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const products = await response.json();
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return null;
        }
    }
    
    function deleteProduct(productId) {
        console.log(productId.id)
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(data => {
            console.log('Product deleted:', data);
            alert(`Product with ID ${productId} deleted successfully!`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting product');
        });
    }


        // DOM Elements
        const productModal = document.getElementById('productModal');
        const groupModal = document.getElementById('groupModal');
        const productForm = document.getElementById('productForm');
        const modalTitle = document.getElementById('modalTitle');
        
        // Add event listeners
        document.getElementById('addProductBtn').addEventListener('click', () => {
            modalTitle.textContent = 'Add New Product';
            productForm.reset();
            openModal('productModal');
        });

        document.getElementById('groupProductsBtn').addEventListener('click', () => {
            openModal('groupModal');
        });

        // Close buttons
        document.querySelectorAll('.close').forEach(button => {
            button.addEventListener('click', () => {
                closeModal();
                closeGroupModal();
            });
        });


        function convertToISOFormat(utcTimestamp) {
            const date = new Date(utcTimestamp);
            return date.toISOString();
        }

// Form submission
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const categorySelect = document.getElementById('category');
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];

    const newProduct = {
        name: document.getElementById('productName').value,
        buying_price: parseFloat(document.getElementById('buyingPrice').value),
        selling_price: parseFloat(document.getElementById('sellingPrice').value),
        category: {
            category_id: selectedOption.getAttribute("data-category"),
            name: selectedOption.value,
            description: selectedOption.getAttribute("data-description"),
            createdAt: convertToISOFormat(selectedOption.getAttribute("data-created-at")),
        },
        description: document.getElementById('description').value,
    };

    //console.log(newProduct);
    saveProduct(newProduct);
    renderProducts();
    closeModal();
});


        // Functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal() {
            productModal.style.display = 'none';
        }

        function closeGroupModal() {
            groupModal.style.display = 'none';
        }

        setTimeout(() => {
            const deleteButtons = document.querySelectorAll('.delete-button');
        
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    console.log(productId)
                    deleteProduct(productId);
                });
            });
        }, 500);

        document.getElementById("groupProducts").addEventListener("click",()=>{
            //console.log()
            const groupName = document.getElementById('groupName').value;
            if (groupName) {
                // Implement grouping logic here
                alert(`Group "${groupName}" created successfully!`);
                save_categories()
                closeGroupModal();
            }
        })

        document.getElementById("closeGroupModal").addEventListener("click",()=>{
            closeGroupModal()
        })


        function renderProducts() {

            fetchProducts().then(products => {
                if (products) {
                    products.forEach(product =>{

            const tableBody = document.getElementById('productTableBody');
            tableBody.innerHTML = products.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>$${product.buying_price.toFixed(2)}</td>
                    <td>$${product.selling_price.toFixed(2)}</td>
                    <td>${product.category.name}</td>
                    <td>${product.description}</td>
                    <td class="action-buttons">
                        <button class="delete-button" data-id="${product.product_id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
                    })
                }
            });



        }

        // Initial render
        renderProducts();
}

function initializeDashboardTab(){
        // Dummy data
        const data = {
            salesData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [12500, 15000, 18000, 16500, 21000, 19500]
            },
        };

        fetch("/api/orders/completed").then(res => {
            return res.json()
        }).then(orders => {
                const sum =  orders.reduce((sum, order) => sum + order.total_amount, 0);
        })

        fetch("/api/orders/all-stats").then(res => {
            return res.json()
        }).then(stats => {
            const stats_cards = document.querySelectorAll(".stat-value")
            stats_cards[0].innerText = stats.totalAmountForCompletedOrders
            stats_cards[1].innerText = stats.totalOrderCount
            stats_cards[2].innerText = stats.lowStockProducts.length
            console.log(stats_cards)
            console.log(stats)
        })

        fetch("/api/orders/top-categories").then(res => {
            return res.json()
        }).then(topCategories => {
            initTopCategories(topCategories)
        })

        fetch("/api/products/recents").then(res => {
            return res.json()
        }).then(recentProducts => {
            initRecentProducts(recentProducts) 
        })

        fetch("/api/orders/recent-sales").then(res => {
            return res.json()
        }).then(recentSales => {
            initLatestSales(recentSales)
        })

        fetch("/api/orders/recent-sales").then(res => {
            return res.json()
        }).then(chartsSales => {
            const total_amount = chartsSales.map((items)=> items.totalAmount)
            const totalSalesDates = chartsSales.map((items)=> items.product.name)
            console.log(total_amount)
            console.log(totalSalesDates)
            initSalesChart(total_amount,totalSalesDates)
        })

        // Initialize Sales Chart
        let salesChartInstance = null; // Store the chart instance globally

function initSalesChart(total_amount, totalSalesDates) {
    const ctx = document.getElementById('salesChart').getContext('2d');

    // Destroy the previous chart if it exists
    if (salesChartInstance !== null) {
        salesChartInstance.destroy();
    }

    // Create a new chart instance and store it
    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: totalSalesDates,
            datasets: [{
                label: 'Sales Rs',
                data: total_amount,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '$' + value.toLocaleString()
                    }
                }
            }
        }
    });
}


        // Initialize Top Categories
        function initTopCategories(topCategories) {
            const categoryList = document.getElementById('categoryList');
            categoryList.innerHTML = topCategories.map(category => `
                <div class="list-item">
                    <div class="item-info">
                        <div class="item-title">${category.category_name}</div>
                    </div>
                    <div class="item-value">${category.total_amount}</div>
                </div>
            `).join('');
        }

        // Initialize Recent Products
        function initRecentProducts(recentProduct) {
            const recentProducts = document.getElementById('recentProducts');
            recentProducts.innerHTML = recentProduct.map(product => `
                <div class="list-item">
                    <div class="item-info">
                        <div class="item-title">${product.name}</div>
                        <div class="item-meta">Added ${product.added_date}</div>
                    </div>
                </div>
            `).join('');
        }

        // Initialize Latest Sales
        function initLatestSales(recentSales) {
            const latestSales = document.getElementById('latestSales');
            latestSales.innerHTML = recentSales.map(sale => `
                <div class="list-item">
                    <div class="item-info">
                        <div class="item-title">${sale.product.name}</div>
                        <div class="item-meta">${sale.orderDate}</div>
                    </div>
                  <div class="item-value">${sale.totalAmount}</div>
                </div>
            `).join('');
        }


            initSalesChart();
            // initTopCategories();
            // initRecentProducts();
       
}

function initializeSalesTab(){

    function formatReadableDate(timestamp) {
        const date = new Date(timestamp);
        
        // Options for formatting the date
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            timeZoneName: 'short' 
        };
    
        return date.toLocaleDateString('en-US', options);
    }
      
    
    
            // Function to render table rows
            function renderSalesTable() {
                const tableBody = document.querySelector('#salesTable tbody');
                tableBody.innerHTML = '';
                

                fetch("/api/orders").then(res => {
                    return res.json()
                }).then(salesData => {
                    salesData.forEach(sale => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td>${formatReadableDate(sale.orderDate)}</td>
                            <td>${sale.order_id}</td>
                            <td>${sale.product.name}</td>
                            <td>${sale.product.category.name}</td>
                            <td>$${sale.product.buying_price.toFixed(2)}</td>
                            <td class="status-${sale.status}">${sale.status}</td>
                            <td>
                                <button class="btn btn-delete" data-id="${sale.order_id}" >Delete</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                })


               
            }
    
            // Modal functionality
            const modal = document.getElementById('orderModal');
            const closeBtn = document.getElementsByClassName('close')[0];
    
            closeBtn.onclick = function() {
                modal.style.display = "none";
            }
    
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
    
            // Action functions
            function viewOrder(id) {
                const order = salesData.find(sale => sale.id === id);
                const modalContent = document.getElementById('modalContent');
                modalContent.innerHTML = `
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Customer:</strong> ${order.customer}</p>
                    <p><strong>Product:</strong> ${order.product}</p>
                    <p><strong>Amount:</strong> $${order.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                `;
                modal.style.display = "block";
            }

     
            setTimeout(() => {
                const deleteButtons = document.querySelectorAll('.btn-delete');
            
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.dataset.id; // Assuming there's a data-id attribute
                        console.log(productId)
                        deleteSales(productId);
                    });
                });
            }, 500); // Adjust the delay if needed
            
            function deleteSales(productId) {
                fetch(`/api/orders/delete/${productId}`, {
                    method: 'DELETE'
                })
                .then(response => response.text())
                .then(data => {
                    console.log('Product deleted:', data);
                    alert(`Product with ID ${productId} deleted successfully!`);
                    renderSalesTable() 
                })
            }
    
        
            // Initialize table
            renderSalesTable();
}

function initializeUsersTab(){
    const userForm = document.getElementById('userForm');
    const userList = document.getElementById('users');
    displayUsers();
    async function saveUser(userData) {
        try {
            const response = await fetch("/api/users/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
    
            if (!response.ok) {
                throw new Error("Failed to save user");
            }
    
            const result = await response.json();
            displayUsers();

        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    

    const modal = document.getElementById('userModal');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = modal.querySelector('.close');

    openModalButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    userForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
            // Example usage
    const newUser = {
        username: username,
        password: password,
        role: role.toLowerCase()
    };
    saveUser(newUser)
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('role').selectedIndex = 0;
        modal.style.display = 'none';
    });

    function displayUsers() {
        fetch("/api/users").then(res => {
            //console.log(res)
            return res.json()
        }).then(users => {
            userList.innerHTML = '';
            //console.log(users)
            users.forEach((user, index) => {
                const li = document.createElement('li');
                const userInfo = document.createElement('span');
                userInfo.textContent = `${user.username} - ${user.role} - ${user.created_at}`;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.setAttribute("data-id",user.id)
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add("delete-btn")
                deleteBtn.style.backgroundColor = '#ef4444';
                deleteBtn.style.color = 'white';
                deleteBtn.style.border = 'none';
                deleteBtn.style.padding = '0.5rem 1rem';
                deleteBtn.style.borderRadius = '0.375rem';
                deleteBtn.style.cursor = 'pointer';
                
                deleteBtn.addEventListener('click', () => {
                    users.splice(index, 1);
                    displayUsers();
                });
                
                li.appendChild(userInfo);
                li.appendChild(deleteBtn);
                userList.appendChild(li);
            });
        })

    }


    document.addEventListener("click", function(event) {
        // //console.log(event)
        if (event.target.classList.contains("delete-btn")) {
            const userId = event.target.getAttribute("data-id");
            //console.log("Delete button clicked for user ID:", userId);
            deleteUser(userId);  // Call your delete function
        }
    });
    
    function deleteUser(userId) {
        console.log(userId)
        fetch(`/api/users/${userId}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                //console.log(`User with ID ${userId} deleted successfully.`);
            } else {
                console.error("Failed to delete user.");
                displayUsers();
            }
        })
        .catch(error => console.error("Error:", error));
    }
    


}

function initializeReportsTab(){
    // Initialization code for the Reports tab
}