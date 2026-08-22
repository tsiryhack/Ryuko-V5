module.exports = async ({ api, event }) => {
  const logger = require('./main/utility/logs.js');
  
  const configCustom = {
    autosetbio: {
      status: false,
      bio: `prefix : ${global.config.PREFIX}`,
      note: 'automatically change the bot bio.'
    },
    greetings: {
      status: true,
      morning: `Bonjour tout le monde ! Passez une excellente journée. ☀️`,
      afternoon: `Bon après-midi à tous, n'oubliez pas de déjeuner ! 🍽️`,
      evening: `Bonsoir tout le monde, j'espère que vous avez passé une bonne journée. 🌆`,
      sleep: `Bonne nuit tout le monde, il est temps de se reposer. 🌙`,
      note: 'Salutations automatiques calées sur l timezone de Madagascar (Antananarivo)'
    },
    accpetPending: {
      status: false,
      time: 10, // 10 minutes
      note: 'approve waiting messages after a certain time, set the status to false if you want to disable auto accept message request.'
    }
  }

  function autosetbio(config) {
    if (config.status) {
      try {
        api.changeBio(config.bio, (err) => {
          if (err) {
            logger(`having some unexpected error : ${err}`, 'setbio')
          }; return logger(`changed the bot bio into : ${config.bio}`, 'setbio')
        })
      } catch (error) {
        logger(`having some unexpected error in auto set bio : ${error}`, 'error')
      }
    }
  }
  
  async function greetings(config) {
    if (config.status) {
      try {
        const nam = [
          {
            timer: '05:00:00',
            message: [`${config.morning}`]
          },
          {
            timer: '12:00:00',
            message: [`${config.afternoon}`]
          },
          {
            timer: '18:00:00',
            message: [`${config.evening}`]
          },
          {
            timer: '22:00:00',
            message: [`${config.sleep}`]
          }
        ];
        const userID = await api.getCurrentUserID();
        
        setInterval(() => {
          const r = a => a[Math.floor(Math.random()*a.length)];
          
          // Récupération de l'heure exacte de Madagascar au format HH:MM:SS
          const currentTimeMada = new Date().toLocaleTimeString('fr-FR', {
            timeZone: 'Indian/Antananarivo',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          const á = nam.find(i => i.timer === currentTimeMada);
          if (á) {
            const allThread = global.data.allThreadID.get(userID);
            if (allThread) {
              allThread.forEach(i => {
                api.sendMessage(r(á.message), i);
              });
            }
          }
        }, 1000);
      } catch (error) {
        logger(`having some unexpected error in greetings : ${error}`, 'error')
      }
    }
  }
  
  function accpetPending(config) {
    if(config.status) {
      setInterval(async () => {
          const list = [
              ...(await api.getThreadList(1, null, ['PENDING'])),
              ...(await api.getThreadList(1, null, ['OTHER']))
          ];
          if (list[0]) {
              api.sendMessage('this thread is automatically approved by our system.', list[0].threadID);
          }
      }, config.time * 60 * 1000)
    }
  }

  autosetbio(configCustom.autosetbio)
  greetings(configCustom.greetings)
  accpetPending(configCustom.accpetPending)
};
