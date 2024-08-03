// // // playoff_script.js
document.addEventListener('DOMContentLoaded', function () {
    let countMatches = 1;
    let side = 1;
    let currentMatchIndex = 0;
    let currentStage = 0;
    const leaders = JSON.parse(localStorage.getItem('leaders')) || generateMockLeaders();
    const stages = ['1/8 Финала', '1/4 Финала', '1/2 Финала', 'Финал'];
    const matchesContainer = document.querySelectorAll('.playoff__round .playoff__groups, .playoff__round--semi-final .playoff__groups, .playoff__round--semi-final-final .playoff__group');
    const nextStageLeaders = [];
    const nextStageLeadersFull = [];

    function generateMockLeaders() {
        return [{
            flag: '🇳🇱',
            name: 'Нидерланды'
        },
        {
            flag: '🇺🇸',
            name: 'США'
        },
        {
            flag: '🇦🇷',
            name: 'Аргентина'
        },
        {
            flag: '🇦🇺',
            name: 'Австралия'
        },
        {
            flag: '🇯🇵',
            name: 'Япония'
        },
        {
            flag: '🇭🇷',
            name: 'Хорватия'
        },
        {
            flag: '🇧🇷',
            name: 'Бразилия'
        },
        {
            flag: '🇰🇷',
            name: 'Корея'
        },
        {
            flag: '🇬🇧',
            name: 'Англия'
        },
        {
            flag: '🇸🇳',
            name: 'Сенегал'
        },
        {
            flag: '🇫🇷',
            name: 'Франция'
        },
        {
            flag: '🇵🇱',
            name: 'Польша'
        },
        {
            flag: '🇲🇦',
            name: 'Марокко'
        },
        {
            flag: '🇪🇸',
            name: 'Испания'
        },
        {
            flag: '🇵🇹',
            name: 'Португалия'
        },
        {
            flag: '🇨🇭',
            name: 'Швейцария'
        },
        ];
    }

    function createMatchElement(team1, team2) {
        const matchElement = document.createElement('div');
        matchElement.className = 'match';
        matchElement.innerHTML = `
        <div class="team">
        ${team1.flag}
        <p>${team1.name}</p>
        <p>${team1.goals || ''}</p>
      </div>
      <div class="team">
        ${team2.flag}
        <p>${team2.name}</p>
        <p>${team2.goals || ''}</p>
      </div>
      `;
        return matchElement;
    }

    function createMatches(teams) {
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            matches.push([teams[i], teams[i + 1]]);
        }
        return matches;
    }

    function setupInitialStage() {
        const roundMatchesLeft = createMatches(leaders.slice(0, 8));
        const roundMatchesRight = createMatches(leaders.slice(8, 16));
        const roundContainerLeft = matchesContainer[0];
        const roundContainerRight = matchesContainer[5];

        roundMatchesLeft.forEach(match => {
            const [team1, team2] = match;
            const groupElement = document.createElement('div');
            groupElement.className = 'group';
            const matchElement = createMatchElement(team1, team2);
            groupElement.appendChild(matchElement);
            roundContainerLeft.appendChild(groupElement);
        });

        roundMatchesRight.forEach(match => {
            const [team1, team2] = match;
            const groupElement = document.createElement('div');
            groupElement.className = 'group';
            const matchElement = createMatchElement(team1, team2);
            groupElement.appendChild(matchElement);
            roundContainerRight.appendChild(groupElement);
        });
    }

    function playNextMatch() {
        if (currentStage >= stages.length) return;

        if (currentStage != 3) {
            const leftContainer = matchesContainer[currentStage];
            const rightContainer = matchesContainer[matchesContainer.length - (currentStage + 1)];

            const roundMatches = [
                ...leftContainer.querySelectorAll('.groud .match'),
                ...rightContainer.querySelectorAll('.groud .match')
            ];

            const matchElement = roundMatches[currentMatchIndex];
            if (!matchElement) return;

            const team1Index = currentMatchIndex * 2;
            const team2Index = team1Index + 1;

            const team1 = leaders[team1Index];
            const team2 = leaders[team2Index];
            const matchResult = simulateMatch(team1, team2);

            matchElement.innerHTML = `
            <div class="team${matchResult.team1.name === matchResult.winner.name ? 'winner' : ''}">
            ${matchResult.team1.flag}
            <p>${matchResult.team1.name}</p>
            <p>${matchResult.team1.goals}</p>
            </div>
            <div class="team${matchResult.team2.name === matchResult.winner.name ? 'winner' : ''}">
            ${matchResult.team2.flag}
            <p>${matchResult.team2.name}</p>
            <p>${matchResult.team2.goals}</p>
            </div> 
            `;

            if (!nextStageLeaders[currentStage]) {
                nextStageLeaders[currentStage] = [];
                nextStageLeadersFull[currentStage] = [];
            }

            if (countMatches === 2) {
                const nextStageLeftContainer = matchesContainer[currentStage + 1];
                const nextStageRightContainer = matchesContainer[matchesContainer.length - (currentStage + 2)];

                const nextRoundMatches = createMatches(nextStageLeaders[currentStage]);
                nextRoundMatches.forEach((match, index) => {
                    const [team1, team2] = match;
                    const groupElement = document.createElement('div');
                    groupElement.className = 'group';
                    const matchElement = createMatchElement(team1, team2);
                    groupElement.appendChild(matchElement);

                    if (side <= 2) {
                        nextStageLeftContainer.appendChild(groupElement);
                        side++;
                    }
                    else {
                        nextStageRightContainer.appendChild(groupElement);
                        side = 1;
                    }

                    if (side === 4) {
                        side = 1;
                    }
                });

                nextStageLeaders[currentStage] = [];
                countMatches = 1;
            } else {
                countMatches++;
            }
            currentMatchIndex++;
            if (currentMatchIndex >= roundMatches.length) {
                currentMatchIndex = 0;
                currentStage++;
                leaders.splice(0, (nextStageLeadersFull[currentStage - 1].length * 2), ...nextStageLeadersFull[currentStage - 1]);
            }
        } else {
            const container = matchesContainer[2];
            const roundMatches = [...container.querySelectorAll('.group .match')];
            const matchElement = roundMatches[currentMatchIndex];

            if (!matchElement) return;

            const team1Index = currentMatchIndex * 2;
            const team2Index = team1Index + 1;

            const team1 = leaders[team1Index];
            const team2 = leaders[team2Index];
            const matchResult = simulateMatch(team1, team2);

            matchElement.innerHTML = `
            <div class="team${matchResult.team1.name === matchResult.winner.name ? 'winner' : ''}">
            ${matchResult.team1.flag}
            <p>${matchResult.team1.name}</p>
            <p>${matchResult.team1.goals}</p>
            </div>
            <div class="team${matchResult.team2.name === matchResult.winner.name ? 'winner' : ''}">
            ${matchResult.team2.flag}
            <p>${matchResult.team2.name}</p>
            <p>${matchResult.team2.goals}</p>
            </div>
            `;

            announceWinner(matchResult.winner);
        }
    }

    function simulateMatch(team1, team2) {
        let team1Goals, team2Goals;

        do {
            team1Goals = Math.floor(Math.random() * 5);
            team2Goals = Math.floor(Math.random() * 5);
        } while (team1Goals === team2Goals);

        const winner = team1Goals > team2Goals ? team1 : team2;

        return {
            team1: {
                ...team1,
                goals: team1Goals
            },
            team2: {
                ...team2,
                goals: team2Goals
            },
            winner
        };
    }

    function announceWinner(winner) {
        const modal = document.getElementById('modal');
        const winnerAnnouncement = document.getElementById('winner-announcement');
        winnerAnnouncement.innerHTML = `<span>Победитель:</span> <span>${winner.flag}</span> <span>${winner.name}</span>`;
        modal.style.display = 'flex';
    }

    document.getElementById('play-next-match').addEventListener('click', playNextMatch);
    document.getElementById('start-new-tournament').addEventListener('click', () => {
        localStorage.removeItem('leaders');
        window.location.href = 'index.html';
    });

    document.querySelector('modal__close-button').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    setupInitialStage();
});