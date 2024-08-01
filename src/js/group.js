document.addEventListener("DOMContentLoaded", function () {
    const groups = [[], [], [], [], [], [], [], []];
    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let currentRound = 0;
    const groupMatches = {};

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    shuffle(countries);

    function generateMatches(group) {
        const matches = [];
        for (let i = 0; i < groups.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                matches.push(group[i], group[j]);
            }
        }
        return matches;
    };

    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < 4; j++) {
            groups[i].push({
                ...countries[i * 4 + j],
                points: 0
            });
        }
        groupMatches[groupNames[i]] = generateMatches(groups[i]);
    };

    function createGroupElements() {
        const groupsConteiner = document.querySelector('.groups');
        groups.forEach((group, index) => {
            const groupElement = document.createElement('div');
            groupElement.className = 'group';
            groupElement.innerHTML = `<h2>Группа ${groupNames[index]}</h2>`;
            group.forEach(team => {
                const teamElement = document.createElement('div');
                teamElement.className = 'team';
                teamElement.innerHTML = `
            ${team.flag}
            <span>${team.name}</span>
            <span>${team.points}</span>
          `;
                groupElement.appendChild(teamElement);
            });
            groupsConteiner.appendChild(groupElement);
        });
    };
    createGroupElements();

    function createLeaderElements() {
        const leadersContainer = document.querySelector('.leaders');
        leadersContainer.innerHTML = '<h2>Лидеры</h2>';
        const leaders = groups.flat().sort((a, b) => b.points - a.points).slice(0, 16);
        leaders.forEach(team => {
            const leaderElement = document.createElement('div');
            leaderElement.className = 'team';
            leaderElement.innerHTML = `
          ${team.flag}
        `;
            leadersContainer.appendChild(leaderElement);
        });
    };

    createLeaderElements();

    function updateLeaders() {
        const leadersConteiner = document.querySelector('.leaders');
        leadersConteiner.innerHTML = '<h2>Лидеры</h2>';
        const leaders = groups.flat().sort((a, b) => b.points - a.points).slice(0, 16);
        leaders.forEach(team => {
            const leaderElement = document.createElement('div');
            leaderElement.className = 'team';
            leaderElement.innerHTML = `
          ${team.flag}`;
            leadersConteiner.appendChild(leaderElement);
        });
    };

    updateLeaders();


});