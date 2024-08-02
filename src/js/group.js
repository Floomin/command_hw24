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
    }

    shuffle(countries);

    function generateMatches(group) {
        const matches = [];
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                matches.push([group[i], group[j]]);
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
        const groupsContainer = document.querySelector('.groups');
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
            groupsContainer.appendChild(groupElement);
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
        const leadersContainer = document.querySelector('.leaders');
        leadersContainer.innerHTML = '<h2>Лидеры</h2>';
        const leaders = groups.flat().sort((a, b) => b.points - a.points).slice(0, 16);
        leaders.forEach(team => {
            const leaderElement = document.createElement('div');
            leaderElement.className = 'team';
            leaderElement.innerHTML = `
          ${team.flag}`;
            leadersContainer.appendChild(leaderElement);
        });
        localStorage.setItem('leaders', JSON.stringify(leaders));
    };

    updateLeaders();


    function playMatch() {
        if (currentRound >= 3) return;

        const matchesContainer = document.querySelector('.matches');
        matchesContainer.innerHTML = '';

        groups.forEach((group, groupIndex) => {
            const roundMatches = groupMatches[groupNames[groupIndex]].slice(currentRound * 2, (currentRound + 1) * 2);

            roundMatches.forEach(match => {
                const [team1, team2] = match;
                const matchResult = simulateMatch(team1, team2);
                const matchElement = document.createElement('div');
                matchElement.className = 'match';
                matchElement.innerHTML = `
                <div class="team">
                ${matchResult.team1.flag}
                <p>${matchResult.team1.name}</p>
                <p>${matchResult.team1.goals}</p>
              </div>
              <div> : </div>
              <div class="team">
                <p>${matchResult.team2.goals}</p>
                <p>${matchResult.team2.name}</p>
                ${matchResult.team2.flag}
              </div>
              `;
              matchesContainer.appendChild(matchElement);
            });


            group.sort((a, b) => b.points - a.points);
            updateGroupElements();
        });

        currentRound++;

        if (currentRound >= 3) {
            document.getElementById('play-match').disabled = true;
            document.getElementById('next-stage').disabled = false;
        }
    }

    function updateGroupElements() {
        const groupContainer = document.querySelector('.groups');
        groupContainer.innerHTML = '';

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
        groupContainer.appendChild(groupElement);
    });
    }

    function simulateMatch(team1, team2) {
        const team1Goals = Math.floor(Math.random() * 6);
        const team2Goals = Math.floor(Math.random() * 6);
        team1.points += team1Goals > team2Goals ? 3 : team1Goals === team2Goals ? 1 : 0;
        team2.points += team2Goals > team1Goals ? 3 : team1Goals === team2Goals ? 1 : 0;
        return { team1: { ...team1, goals: team1Goals }, team2: { ...team2, goals: team2Goals} };
    }

    document.getElementById('play-match').addEventListener('click', playMatch, updateLeaders());
});