// Switches list
const switches = [
    { id: "fan1", name: "Fan 1" },
    { id: "fan2", name: "Fan 2" },
    { id: "fan3", name: "Fan 3" },
    { id: "fan4", name: "Fan 4" },
    { id: "light1", name: "Light 1" },
    { id: "light2", name: "Light 2" },
    { id: "light3", name: "Light 3" }
];

const switchesGrid = document.getElementById('switches-grid');
const statusText = document.getElementById('status-text');

// Generate switches dynamically
switches.forEach(sw => {
    const card = document.createElement('div');
    card.className = 'switch-card';
    card.id = sw.id;

    const title = document.createElement('h3');
    title.textContent = sw.name;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn off';
    toggleBtn.textContent = 'OFF';

    // Toggle button click
    toggleBtn.addEventListener('click', () => {
        const ref = db.ref('switches/' + sw.id);
        ref.once('value').then(snapshot => {
            const newState = !snapshot.val();
            ref.set(newState);
        });
    });

    // Listen for real-time updates from Firebase
    db.ref('switches/' + sw.id).on('value', snapshot => {
        const state = snapshot.val();
        toggleBtn.textContent = state ? 'ON' : 'OFF';
        toggleBtn.classList.remove('on','off');
        toggleBtn.classList.add(state ? 'on' : 'off');
        updateStatusText();
    });

    card.appendChild(title);
    card.appendChild(toggleBtn);
    switchesGrid.appendChild(card);
});

// All On / All Off
document.getElementById('all-on-btn').addEventListener('click', () => {
    switches.forEach(sw => db.ref('switches/' + sw.id).set(true));
});

document.getElementById('all-off-btn').addEventListener('click', () => {
    switches.forEach(sw => db.ref('switches/' + sw.id).set(false));
});

// Update status
function updateStatusText() {
    let activeCount = 0;
    switches.forEach(sw => {
        const state = document.getElementById(sw.id).querySelector('.toggle-btn').classList.contains('on');
        if(state) activeCount++;
    });
    statusText.textContent = `${activeCount} of ${switches.length} switches active`;
}

