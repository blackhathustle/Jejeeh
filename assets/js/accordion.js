document.addEventListener('DOMContentLoaded', () => {
    const accordionContainers = document.querySelectorAll('.acordeon-container');
    const summaryItems = document.querySelector('.summary-items');
    const totalValue = document.querySelector('.total-value');
    const ticketsCount = document.querySelector('.tickets-count');

    function formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function updateSummary() {
        summaryItems.innerHTML = '';
        let total = 0;
        let totalTickets = 0;

        accordionContainers.forEach(container => {
            const quantity = Array.from(container.querySelectorAll('.quantity'))
                .reduce((sum, el) => sum + parseInt(el.textContent), 0);

            totalTickets += quantity;

            if (quantity > 0) {
                const title = container.querySelector('.acordeon-title').textContent;
                const ticketTitle = container.querySelector('.ticket-title').textContent;
                const priceText = container.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
                const itemTotal = price * quantity;
                total += itemTotal;

                const itemElement = document.createElement('div');
                itemElement.className = 'summary-item';
                itemElement.innerHTML = `
                    <div class="item-info">
                        <div>
                            <span class="item-quantity">${quantity}x</span>
                            <span class="item-title">${title}</span>
                        </div>
                        <span class="item-subtitle">${ticketTitle}</span>
                        <button class="remove-item" data-container="${title}">remover</button>
                    </div>
                    <div class="item-price">${formatPrice(itemTotal)}</div>
                `;

                summaryItems.appendChild(itemElement);

                const removeButton = itemElement.querySelector('.remove-item');
                removeButton.addEventListener('click', (e) => {
                    const containerTitle = e.target.dataset.container;
                    const targetContainer = Array.from(accordionContainers)
                        .find(cont => cont.querySelector('.acordeon-title').textContent === containerTitle);
                    
                    if (targetContainer) {
                        const quantityElements = targetContainer.querySelectorAll('.quantity');
                        quantityElements.forEach(el => el.textContent = '0');
                        targetContainer.classList.remove('has-selected');
                        const selectedTickets = targetContainer.querySelector('.selected-tickets');
                        selectedTickets.style.display = 'none';
                        updateSummary();
                    }
                });
            }
        });

        totalValue.textContent = formatPrice(total);
        ticketsCount.textContent = totalTickets;
    }

    accordionContainers.forEach(container => {
        const header = container.querySelector('.acordeon-header');
        
        header.addEventListener('click', () => {
            container.classList.toggle('active');
        });
    });

    const quantityButtons = document.querySelectorAll('.btn-add');
    
    quantityButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const ticketItem = button.closest('.ticket-item');
            const container = button.closest('.acordeon-container');
            const quantityElement = ticketItem.querySelector('.quantity');
            const selectedTicketsElement = container.querySelector('.selected-tickets');
            let quantity = parseInt(quantityElement.textContent);
            
            if (button.classList.contains('plus')) {
                quantity = Math.min(quantity + 1, 10);
            } else {
                quantity = Math.max(quantity - 1, 0);
            }
            
            quantityElement.textContent = quantity;

            const totalSelected = Array.from(container.querySelectorAll('.quantity'))
                .reduce((sum, el) => sum + parseInt(el.textContent), 0);

            if (totalSelected > 0) {
                selectedTicketsElement.textContent = `${totalSelected} ingresso${totalSelected !== 1 ? 's' : ''} selecionado${totalSelected !== 1 ? 's' : ''}`;
                selectedTicketsElement.style.display = 'inline';
                container.classList.add('has-selected');
            } else {
                selectedTicketsElement.style.display = 'none';
                container.classList.remove('has-selected');
            }

            updateSummary();
        });
    });
});
