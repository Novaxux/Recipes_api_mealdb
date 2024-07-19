document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('recipe-container');
    let currentPage = 1;
    const perPage = 2;
    let totalRecipes = 0;
    let totalPages = 0;

    // Function to fetch recipes from the API
    const getRecipes = async () => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=&page=${currentPage}`);
            const data = await response.json();
            
            totalRecipes = data.meals.length;
            totalPages = Math.ceil(totalRecipes / perPage);

            // Clear the container before adding new cards
            container.innerHTML = '';

            // Iterate only through the recipes needed for this page
            const startIndex = (currentPage - 1) * perPage;
            const endIndex = startIndex + perPage;
            data.meals.slice(startIndex, endIndex).forEach(meal => {
                const card = document.createElement('div');
                card.classList.add('card');
                const imageUrl = meal.strMealThumb;
                const mealName = meal.strMeal;
                const mealCategory = meal.strCategory;
                const mealInstructions = meal.strInstructions;

                // Cut instructions to 150 words and save the full instructions
                let shortInstructions = mealInstructions.split(' ').slice(0, 150).join(' ');
                let fullInstructions = mealInstructions;

                // Determine if "Read more" button is needed for this specific recipe
                let needsReadMoreButton = mealInstructions.split(' ').length > 150;

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${mealName}">
                    <div class="info">
                        <h3>${mealName}</h3>
                        <p><strong>Category:</strong> ${mealCategory}</p>
                        <p class="instructions">${shortInstructions}</p>
                        ${needsReadMoreButton ? '<button class="read-more">Read more</button>' : ''}
                    </div>
                `;

                container.appendChild(card);

                if (needsReadMoreButton) {
                    const readMoreButton = card.querySelector('.read-more');
                    readMoreButton.addEventListener('click', () => {
                        const instructionsPara = card.querySelector('.instructions');
                        instructionsPara.textContent = fullInstructions;
                        readMoreButton.style.display = 'none'; // Hide "Read more" button
                        
                        // Create "Read less" button
                        const readLessButton = document.createElement('button');
                        readLessButton.textContent = 'Read less';
                        readLessButton.classList.add('read-less');
                        readLessButton.classList.add('read-more');
                        readLessButton.addEventListener('click', () => {
                            instructionsPara.textContent = shortInstructions;
                            readMoreButton.style.display = 'inline-block'; // Show "Read more" button again
                            readLessButton.style.display = 'none'; // Hide "Read less" button
                        });
                        card.querySelector('.info').appendChild(readLessButton);
                    });
                }
            });

            // Update pagination buttons
            renderPaginationButtons();

        } catch (error) {
            console.log('Error fetching recipes:', error);
        }
    };

    // Function to render pagination buttons
    const renderPaginationButtons = () => {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                getRecipes();
            }
        });
        paginationContainer.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
        paginationContainer.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                getRecipes();
            }
        });
        paginationContainer.appendChild(nextButton);
    };

    // Call function to fetch recipes when the page loads
    getRecipes();
});
