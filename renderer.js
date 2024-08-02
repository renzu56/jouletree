const saveBtn = document.getElementById('save');
const loadBtn = document.getElementById('load');
const addWordNodeBtn = document.getElementById('add-word-node');
const addTodoNodeBtn = document.getElementById('add-todo-node');

addWordNodeBtn.addEventListener('click', () => {
    createNode(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 'word');
});

addTodoNodeBtn.addEventListener('click', () => {
    createNode(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 'todo');
});

saveBtn.addEventListener('click', async () => {
    const mindmapData = saveMindMap(); // Assuming saveMindMap returns the data
    const filePath = await window.api.saveFile(JSON.stringify(mindmapData, null, 2));
    console.log(`Mind map saved to ${filePath}`);
});

loadBtn.addEventListener('click', async () => {
    const jsonString = await window.api.openFile();
    if (jsonString) {
        const mindmapData = JSON.parse(jsonString);
        loadMindMap(mindmapData); // Assuming loadMindMap can accept the data
    }
});
