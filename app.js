let nodes = [];
let connections = [];

// List of quotes
const quotes = [
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "You miss 100% of the shots you don't take.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your time is limited, so don’t waste it living someone else’s life.",
    // Add more quotes here (up to around 400)
    "Do not wait to strike till the iron is hot; but make it hot by striking.",
    "Great spirits have always encountered violent opposition from mediocre minds.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "If you can dream it, you can do it.",
    "Act as if what you do makes a difference. It does.",
    "Success is not how high you have climbed, but how you make a positive difference to the world.",
    "Keep your face always toward the sunshine—and shadows will fall behind you.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Your life does not get better by chance, it gets better by change.",
    "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "The only way to achieve the impossible is to believe it is possible.",
    "You are never too old to set another goal or to dream a new dream.",
    "The best revenge is massive success.",
    "If you want to lift yourself up, lift up someone else.",
    "Your time is precious, so do not waste it living someone else's life.",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    "Dream big and dare to fail.",
    "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
    "To see what is right and not do it is a lack of courage.",
    "It always seems impossible until it's done.",
    "The best way to predict your future is to create it.",
    "If you want something you've never had, you must be willing to do something you've never done.",
    "In the end, we only regret the chances we didn't take.",
    // Continue adding quotes up to around 400
];

// Function to display a random quote
function displayRandomQuote() {
    const quoteElement = document.getElementById('quote');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
    quoteElement.style.opacity = 0;
    setTimeout(() => {
        quoteElement.style.opacity = 1;
    }, 100);
}

// Display a new quote every day
function showDailyQuote() {
    displayRandomQuote();
    setInterval(displayRandomQuote, 24 * 60 * 60 * 1000); // Change quote every 24 hours
}

document.addEventListener("DOMContentLoaded", showDailyQuote);

function createNode(x, y, type, content = '', done = false) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node');
    nodeElement.style.left = `${x}px`;
    nodeElement.style.top = `${y}px`;
    nodeElement.setAttribute('draggable', 'true');

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = function() {
        deleteNode(nodeElement);
    };

    if (type === 'word') {
        const wordInput = document.createElement('input');
        wordInput.setAttribute('type', 'text');
        wordInput.setAttribute('placeholder', 'Enter word');
        wordInput.value = content;
        nodeElement.appendChild(wordInput);
    } else if (type === 'todo') {
        const todoInput = document.createElement('input');
        todoInput.setAttribute('type', 'text');
        todoInput.setAttribute('placeholder', 'Enter to-do');
        todoInput.value = content;

        const doneCheckbox = document.createElement('input');
        doneCheckbox.setAttribute('type', 'checkbox');
        doneCheckbox.checked = done;
        if (done) {
            nodeElement.classList.add('done');
        }
        doneCheckbox.addEventListener('change', () => {
            if (doneCheckbox.checked) {
                nodeElement.classList.add('done');
            } else {
                nodeElement.classList.remove('done');
            }
        });

        nodeElement.appendChild(todoInput);
        nodeElement.appendChild(doneCheckbox);
        nodeElement.appendChild(document.createTextNode(' Done'));
    } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = content;
        img.classList.add('resizable-image'); // Add a class for styling
        nodeElement.appendChild(img);
    }

    nodeElement.appendChild(deleteButton); // Append delete button to node

    document.getElementById('node-container').appendChild(nodeElement);
    nodes.push(nodeElement);

    interact(nodeElement).draggable({
        listeners: {
            move(event) {
                const target = event.target;
                target.style.left = `${parseFloat(target.style.left) + event.dx}px`;
                target.style.top = `${parseFloat(target.style.top) + event.dy}px`;
                updateConnections();
            }
        }
    });

    nodeElement.addEventListener('dblclick', () => {
        if (connections.length > 0 && connections[connections.length - 1].endNode === null) {
            connections[connections.length - 1].endNode = nodeElement;
        } else {
            connections.push({ startNode: nodeElement, endNode: null });
        }
        updateConnections();
    });

    updateConnections();
}


function updateConnections() {
    const canvas = document.getElementById('connectionCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach(connection => {
        if (connection.endNode !== null) {
            const startRect = connection.startNode.getBoundingClientRect();
            const endRect = connection.endNode.getBoundingClientRect();

            ctx.beginPath();
            ctx.moveTo(startRect.left + startRect.width / 2, startRect.top + startRect.height / 2);
            ctx.lineTo(endRect.left + endRect.width / 2, endRect.top + endRect.height / 2);
            ctx.stroke();
        }
    });
}

// Add a function to create a new mind map
function newMindMap() {
    nodes.forEach(node => node.remove());
    nodes = [];
    connections = [];
}

// Add event listener for the image input
// Add event listener for the image input
document.getElementById('image-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.position = 'absolute';
            img.style.left = `${Math.random() * window.innerWidth}px`;
            img.style.top = `${Math.random() * window.innerHeight}px`;
            img.style.width = '100px'; // Set initial width
            img.style.height = 'auto'; // Maintain aspect ratio
            img.style.cursor = 'move'; // Change cursor when hovering over image
            img.setAttribute('draggable', 'false'); // Disable default image dragging

            // Make the image draggable
            interact(img).draggable({
                listeners: {
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        // Update the element's position
                        target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                },
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'document'
                    })
                ]
            });

            // Resize the image when clicking and dragging on the corners
            interact(img).resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                restrictEdges: {
                    outer: 'parent',
                    endOnly: true,
                },
                inertia: true,
            }).on('resizemove', (event) => {
                const target = event.target;

                // Update the element's size
                target.style.width = `${event.rect.width}px`;
                target.style.height = 'auto'; // Maintain aspect ratio
            });

            document.getElementById('node-container').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// Existing code...

document.getElementById('add-image-node').addEventListener('click', () => {
    document.getElementById('image-input').click();
});

function createNode(x, y, type, content = '', done = false) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node');
    nodeElement.style.left = `${x}px`;
    nodeElement.style.top = `${y}px`;
    nodeElement.setAttribute('draggable', 'true');

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = function() {
        deleteNode(nodeElement);
    };
    
    nodeElement.appendChild(deleteButton); // Append delete button to node
    
    if (type === 'word') {
        const wordInput = document.createElement('input');
        wordInput.setAttribute('type', 'text');
        wordInput.setAttribute('placeholder', 'Enter word');
        wordInput.value = content;
        nodeElement.appendChild(wordInput);
    } else if (type === 'todo') {
        const todoInput = document.createElement('input');
        todoInput.setAttribute('type', 'text');
        todoInput.setAttribute('placeholder', 'Enter to-do');
        todoInput.value = content;

        const doneCheckbox = document.createElement('input');
        doneCheckbox.setAttribute('type', 'checkbox');
        doneCheckbox.checked = done;
        if (done) {
            nodeElement.classList.add('done');
        }
        doneCheckbox.addEventListener('change', () => {
            if (doneCheckbox.checked) {
                nodeElement.classList.add('done');
            } else {
                nodeElement.classList.remove('done');
            }
        });

    


        nodeElement.appendChild(todoInput);
        nodeElement.appendChild(doneCheckbox);
        nodeElement.appendChild(document.createTextNode(' Done'));
    } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = content;
        img.classList.add('resizable-image'); // Add a class for styling
        nodeElement.appendChild(img);
    }

    document.getElementById('node-container').appendChild(nodeElement);
    nodes.push(nodeElement);

    interact(nodeElement).draggable({
        listeners: {
            move(event) {
                const target = event.target;
                target.style.left = `${parseFloat(target.style.left) + event.dx}px`;
                target.style.top = `${parseFloat(target.style.top) + event.dy}px`;
                updateConnections();
            }
        }
    });

    nodeElement.addEventListener('dblclick', () => {
        if (connections.length > 0 && connections[connections.length - 1].endNode === null) {
            connections[connections.length - 1].endNode = nodeElement;
        } else {
            connections.push({ startNode: nodeElement, endNode: null });
        }
        updateConnections();
    });

    updateConnections();
}

// Existing code...

// Add a function to save mind map data and return it
function saveMindMap() {
    const mindmapData = {
        nodes: nodes.map(node => ({
            type: node.querySelector('input[placeholder]').getAttribute('placeholder') === 'Enter word' ? 'word' : 'todo',
            position: { left: node.style.left, top: node.style.top },
            content: node.querySelector('input[placeholder]').value,
            done: node.querySelector('input[type=checkbox]') ? node.querySelector('input[type=checkbox]').checked : null
        })),
        connections: connections.map(connection => ({
            startIndex: nodes.indexOf(connection.startNode),
            endIndex: nodes.indexOf(connection.endNode)
        }))
    };


    localStorage.setItem('mindmapData', JSON.stringify(mindmapData));
    return mindmapData; // Return the data for saving to file
}

// Add a function to load mind map with provided data
function loadMindMap(mindmapData) {
    if (!mindmapData) return;

    nodes.forEach(node => node.remove());
    nodes = [];
    connections = [];

    mindmapData.nodes.forEach(nodeData => {
        createNode(
            parseFloat(nodeData.position.left),
            parseFloat(nodeData.position.top),
            nodeData.type,
            nodeData.content,
            nodeData.done
        );
    });

    mindmapData.connections.forEach(connectionData => {
        connections.push({
            startNode: nodes[connectionData.startIndex],
            endNode: nodes[connectionData.endIndex]
        });
    });

    updateConnections();
}
// Function to delete a node
// Function to delete a node
// Function to delete the selected node
function deleteNode(nodeElement) {
    // Remove the node from the DOM
    nodeElement.remove();
    
    // Remove the node from the nodes array
    const index = nodes.indexOf(nodeElement);
    if (index !== -1) {
        nodes.splice(index, 1);
    }
    
    // Remove any connections involving the deleted node
    connections = connections.filter(connection => connection.startNode !== nodeElement && connection.endNode !== nodeElement);
    
    // Update connections after deletion
    updateConnections();
}


