(function() {
    // VERIFICAÇÃO DE DUPLICIDADE - DEVE SER DENTRO DA FUNÇÃO
    if (document.getElementById('bookflow-popup')) return;

    // ============================================================================
    // SISTEMA DE TRATAMENTO DE ASPAS
    // ============================================================================
    
    class TratamentoAspas {
        // Converte texto com aspas problemáticas para formato seguro
        static escapeTexto(texto) {
            if (!texto) return '';
            
            // Primeiro, substitui aspas simples por uma versão segura
            let processado = texto
                .replace(/'/g, '\\\'')  // Escape aspas simples
                .replace(/"/g, '\\"')   // Escape aspas duplas
                .replace(/`/g, '\\`')   // Escape crases
                .replace(/‘/g, "'")     // Aspa curva simples para reta
                .replace(/’/g, "'")     // Aspa curva simples para reta
                .replace(/“/g, '"')     // Aspa curva dupla para reta
                .replace(/”/g, '"');    // Aspa curva dupla para reta
            
            // Remove múltiplos escapes consecutivos
            processado = processado.replace(/\\\\\\/g, '\\');
            
            return processado;
        }
        
        // Recupera o texto original (para exibição)
        static unescapeTexto(texto) {
            if (!texto) return '';
            
            return texto
                .replace(/\\'/g, "'")
                .replace(/\\"/g, '"')
                .replace(/\\`/g, '`');
        }
        
        // Normaliza texto para comparação (remove problemas de formatação)
        static normalizarParaComparacao(texto) {
            if (!texto) return '';
            
            return texto
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/[‘’'`"“”]/g, '') // Remove TODOS os tipos de aspas
                .replace(/[.,!?;:()\[\]{}]/g, ' ') // Remove pontuação
                .replace(/\s+/g, ' ') // Normaliza espaços
                .trim();
        }
        
        // Verifica se textos são equivalentes considerando variações de aspas
        static compararComAspas(texto1, texto2) {
            if (!texto1 || !texto2) return false;
            
            // Comparação direta
            if (texto1 === texto2) return true;
            
            // Normaliza ambos os textos
            const norm1 = this.normalizarParaComparacao(texto1);
            const norm2 = this.normalizarParaComparacao(texto2);
            
            // Comparação após normalização
            if (norm1 === norm2) return true;
            
            // Verifica se um está contido no outro
            if (norm1.includes(norm2) || norm2.includes(norm1)) {
                return true;
            }
            
            // Calcula similaridade simples
            return this.calcularSimilaridade(norm1, norm2) > 0.9;
        }
        
        // Calcula similaridade básica entre textos
        static calcularSimilaridade(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            
            if (longer.length === 0) return 1.0;
            
            // Se um texto está contido no outro
            if (longer.includes(shorter)) {
                return shorter.length / longer.length;
            }
            
            // Algoritmo simples de similaridade
            let matches = 0;
            for (let i = 0; i < shorter.length; i++) {
                if (longer.includes(shorter[i])) {
                    matches++;
                }
            }
            
            return matches / longer.length;
        }
    }

    // ============================================================================
    // BANCO DE DADOS - RESPOSTAS CORRETAS POR LIVRO
    // ============================================================================
    
    // Usamos a função de escape para todas as respostas com aspas
    const bancoRespostas = {
        "O menino que descobriu o vento": [
            TratamentoAspas.escapeTexto("Ei, homem, lamento por você!"),
            "Fecharam suas lojas.",
            "Enfatizar que as pernas ficaram fracas, trêmulas e sem",
            "a Malaui, o país onde fora criado.",
            "Enfado.",
            "a um garoto grandão",
            "uma relação de restrição.",
            "adição e alternância",
            "no Malaui, o milho é tão importante quanto a água que",
            "Empresa de Fornecimento de Eletricidade do Malaui.",
            TratamentoAspas.escapeTexto("[...] a nsima é tão importante na nossa dieta que sem ela nos"),
            TratamentoAspas.escapeTexto("Assim que a cliente tirava o balde do cano, as crianças se"),
            "Como um ambiente hostil, marcado pela fome, abandono e",
            "são os gemidos de fome do cão da família.",
            "Verão.",
            TratamentoAspas.escapeTexto("Um fazendeiro que compareceu a um funeral a trouxe"),
            "uma saliência.",
            TratamentoAspas.escapeTexto("Quando o consegui, Khamba levantou a cabeça e começou a"),
            "O garoto iria sacrificar o seu cão para aliviar o",
            TratamentoAspas.escapeTexto("Com a maioria do povo do Malaui ainda sofrendo as"),
            "Condição.",
            TratamentoAspas.escapeTexto("Raio Mortal."),
            "formal.",
            TratamentoAspas.escapeTexto("Agora, quando eu voltava para casa com minhas peças, ela me"),
            "contraste.",
            "Frustrante.",
            "indicam que trata-se de um pensamento do narrador.",
            "Narrador em 1ª pessoa.",
            "eficiente.",
            "Geoffrey.",
            TratamentoAspas.escapeTexto("Este processo é chamado de indução mútua, o que significa"),
            "Uma falha estrutural e/ou social que impede o",
            "vampiros que roubavam partes do corpo das pessoas e",
            TratamentoAspas.escapeTexto("Uma catástrofe foi evitada, mas ainda sim revelou um"),
            TratamentoAspas.escapeTexto("[...] desta vez, em vez de pôr a culpa no clima, culparam a"),
            "finalidade.",
            "A perseverança e a crença no poder da dedicação para",
            "contentamento.",
            "um moinho de vento para gerar eletricidade e"
        
        ].map(resp => TratamentoAspas.escapeTexto(resp)), // Garante que todas as respostas são seguras
        
        "Dom Casmurro": [
            "Bentinho (Bento Santiago)",
            "Capitu",
            "Ciúmes e dúvida sobre a fidelidade",
            "Escobar",
            "Sim, ao final ele acredita na traição",
            "São Paulo do século XIX",
            "D. Glória",
            "José Dias",
            "Seminário",
            "Olhos de ressaca"
        ].map(resp => TratamentoAspas.escapeTexto(resp)),
        
        "Diário de um Banana: As memórias de Greg Heffley": [
            "Bairro residencial.",
            "O dia da semana em que Greg começou a escrever no seu diário era quarta-feira.",
            "diário.",
            "V-V-F.",
            "Isso realmente incomodou o Rodrick, então ele foi até uma loja e voltou quinze minutos depois com uns fones de ouvido.",
            "O fato de outro garoto chamado Marty Porter estar concorrendo ao mesmo cargo de tesoureiro e ele ser um verdadeiro crânio em matemática.",
            "FATO-FATO-OPINIÃO-FATO-OPINIÃO.",
            "2-1-4-3.",
            "Greg Heffley sentava-se no fundo e ao lado dele havia um mapa gigante com todas as capitais, isto facilitaría as coisas para ele.",
            "Luta livre.",
            "Mas, após alguns segundos, as outras Árvores perceberam que eu não estava cantando.",
            "As cortinas ergueram-se.",
            "As afirmativas I e II estão corretas.",
            "Então, foi por isso que eu fui mandado para a cama às 7:00 e não estou no andar de baixo vendo o especial de Ano-Novo na TV.",
            "2-4-1-3.",
            "E, acredite se quiser, as habilidades de desenho de Rowley são ainda piores do que as de escrita.",
            "As afirmativas I, III e IV estão corretas.",
            "Porque tinha medo de perder seus privilégios.",
            "Greg Heffley disse que era alérgico a laticínios.",
            "Tempo."
        ].map(resp => TratamentoAspas.escapeTexto(resp))
    };

    // Função para obter respostas formatadas para exibição
    function obterRespostasParaExibicao(livro) {
        if (!livro || !bancoRespostas[livro]) return [];
        return bancoRespostas[livro].map(resp => TratamentoAspas.unescapeTexto(resp));
    }

    // ============================================================================
    // CONFIGURAÇÕES GLOBAIS
    // ============================================================================

    const CONFIG = {
        darkModeColors: {
            background: '#0f0f23',
            surface: '#1a1a2e',
            card: '#16213e',
            text: '#e6e6ff',
            textLight: '#a0a0cc',
            textImportant: '#ffffff',
            primary: '#6366f1',
            success: '#10b981',
            accent: '#f59e0b',
            border: '#2d2d5a',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        lightModeColors: {
            background: '#ffffff',
            surface: '#f8fafc',
            card: '#ffffff',
            text: '#334155',
            textLight: '#64748b',
            textImportant: '#0f172a',
            primary: '#3b82f6',
            success: '#10b981',
            accent: '#f59e0b',
            border: '#e2e8f0',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        }
    };

    // ========== DETECÇÃO DE DISPOSITIVO ==========
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const popupSize = isMobile ? 0.6 : 0.85;

    // ========== SISTEMA DE WIDGETS LIVEPIX ==========
    const LivePixWidgets = {
        widgets: {
          donation: {
            id: 'e469d696-eab2-4c3f-9154-058e42a56b08',
            container: 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9998;width:min(400px,95vw);overflow:hidden;background:transparent;pointer-events:none',
            iframe: 'width:800px;height:400px;border:none;transform:scale(0.5);transform-origin:top left;background:transparent;color-scheme:normal !important;pointer-events:none'
          },
          qr: {
            id: '0468d92a-238e-4720-abdf-75167b5c59d6',
            container: 'position:fixed;bottom:60px;right:0px;z-index:9998;height:225px;overflow:hidden;background:transparent;pointer-events:none',
            iframe: 'width:400px;height:600px;border:none;transform:scale(0.45);transform-origin:top right;background:transparent;color-scheme:normal !important;pointer-events:none'
          },
          donators: {
            id: '36e12ce5-53b0-4d75-81bb-310e9d9023e0',
            container: 'position:fixed;top:50px;left:20px;z-index:9998;width:200px;overflow:hidden;background:transparent;pointer-events:none',
            iframe: 'width:300px;height:150px;border:none;transform:scale(0.5);transform-origin:top left;background:transparent;color-scheme:normal !important;pointer-events:none'
          }
        },

        init() {
          this.createWidgets();
          this.setupEventListeners();
        },

        createWidgets() {
          const donationContainer = this.createWidget(this.widgets.donation);
          donationContainer.id = 'livepix-donation';
          document.body.appendChild(donationContainer);
          this.donationContainer = donationContainer;

          if (!isMobile) {
            const qrContainer = this.createWidget(this.widgets.qr);
            qrContainer.id = 'livepix-qr';
            document.body.appendChild(qrContainer);
            this.qrContainer = qrContainer;

            const donatorsContainer = this.createWidget(this.widgets.donators);
            donatorsContainer.id = 'livepix-donators';
            document.body.appendChild(donatorsContainer);
            this.donatorsContainer = donatorsContainer;
          }
          
          // Tornar widgets visíveis por padrão
          this.toggleWidgets(true);
        },

        createWidget(config) {
          const container = document.createElement('div');
          container.style.cssText = config.container;
          
          const iframe = document.createElement('iframe');
          iframe.src = `https://widget.livepix.gg/embed/${config.id}`;
          iframe.style.cssText = config.iframe;
          iframe.allowTransparency = true;
          iframe.allow = 'autoplay; encrypted-media';
          
          container.appendChild(iframe);
          return container;
        },

        setupEventListeners() {
          const observer = new MutationObserver(() => {
            if (this.qrContainer) {
              const isProfilePage = window.location.pathname.includes('/profile');
              this.qrContainer.style.bottom = isProfilePage ? '0px' : '60px';
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
          });

          if (window.plppdo) {
            window.plppdo.on('domChanged', () => {
              if (this.qrContainer) {
                const isProfilePage = window.location.pathname.includes('/profile');
                this.qrContainer.style.bottom = isProfilePage ? '0px' : '60px';
              }
            });
          }
        },

        toggleWidgets(show) {
          const widgets = [
            this.donationContainer,
            this.qrContainer,
            this.donatorsContainer
          ].filter(widget => widget);

          widgets.forEach(widget => {
            widget.style.display = show ? 'block' : 'none';
          });
        }
    };

    // ========== SISTEMA DE SPLASH SCREEN ==========
    const SplashScreen = {
        show() {
          const splash = document.createElement('div');
          splash.id = 'bookflow-splash';
          splash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${CONFIG.darkModeColors.background};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000001;
            font-family: 'Inter', system-ui, sans-serif;
            color: ${CONFIG.darkModeColors.text};
            transition: opacity 0.5s ease;
          `;

          splash.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <div style="
                width: 80px;
                height: 80px;
                background: ${CONFIG.darkModeColors.gradient};
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 40px;
                color: white;
              ">📚</div>
              <h1 style="font-size: 32px; margin-bottom: 10px; color: ${CONFIG.darkModeColors.textImportant};">
                BookFlow
              </h1>
              <p style="color: ${CONFIG.darkModeColors.textLight}; margin-bottom: 30px;">
                Sistema Inteligente de Quiz
              </p>
              <div style="
                width: 200px;
                height: 6px;
                background: ${CONFIG.darkModeColors.border};
                border-radius: 3px;
                margin: 0 auto;
                position: relative;
                overflow: hidden;
              ">
                <div id="splash-progress" style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  height: 100%;
                  background: ${CONFIG.darkModeColors.gradient};
                  width: 0%;
                  transition: width 0.3s ease;
                "></div>
              </div>
              <p style="color: ${CONFIG.darkModeColors.textLight}; font-size: 13px; margin-top: 20px;">
                Inicializando sistema...
              </p>
            </div>
          `;

          document.body.appendChild(splash);
          this.splash = splash;
          this.animateProgress();
        },

        animateProgress() {
          const progress = document.getElementById('splash-progress');
          let width = 0;
          
          const interval = setInterval(() => {
            width += Math.random() * 15;
            if (width >= 100) {
              width = 100;
              clearInterval(interval);
            }
            progress.style.width = width + '%';
          }, 200);
        },

        hide() {
          if (this.splash) {
            this.splash.style.opacity = '0';
            setTimeout(() => {
              if (this.splash && this.splash.parentNode) {
                this.splash.parentNode.removeChild(this.splash);
              }
            }, 500);
          }
        }
    };

    // ========== SISTEMA DE TOAST ==========
    const ToastSystem = {
        show(message, duration = 3000, position = 'top') {
          const toast = document.createElement('div');
          toast.style.cssText = `
            position: fixed;
            ${position === 'top' ? 'top: 20px' : 'bottom: 20px'};
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${CONFIG.darkModeColors.surface};
            color: ${CONFIG.darkModeColors.text};
            padding: 12px 20px;
            border-radius: 12px;
            border: 1px solid ${CONFIG.darkModeColors.border};
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 1000002;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 14px;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 8px;
          `;

          toast.innerHTML = `
            <span>${this.getIcon(message)}</span>
            <span>${message}</span>
          `;

          document.body.appendChild(toast);

          setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
          }, 100);

          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
              if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
              }
            }, 300);
          }, duration);
        },

        getIcon(message) {
          if (message.includes('✅') || message.includes('sucesso')) return '✅';
          if (message.includes('❌') || message.includes('erro')) return '❌';
          if (message.includes('⭐') || message.includes('bem-vindo')) return '⭐';
          if (message.includes('🚀')) return '🚀';
          if (message.includes('🌿')) return '🌿';
          if (message.includes('🎁')) return '🎁';
          if (message.includes('🔤')) return '🔤';
          return 'ℹ️';
        }
    };

    // ========== SISTEMA DE UTILITÁRIOS ==========
    const Utils = {
        debounce(func, wait) {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        },

        async safeExecute(operation, errorMessage) {
          try {
            return await operation();
          } catch (error) {
            console.error(`${errorMessage}:`, error);
            ToastSystem.show(`❌ ${errorMessage}`, 4000);
            return null;
          }
        },

        throttle(func, limit) {
          let inThrottle;
          return function(...args) {
            if (!inThrottle) {
              func.apply(this, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
            }
          };
        },

        getSize(baseSize) {
          return baseSize * popupSize;
        },

        delay(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // ========== SISTEMA DE ARRASTAR ==========
    class DragManager {
        constructor(element) {
          this.element = element;
          this.isDragging = false;
          this.offset = { x: 0, y: 0 };
          this.bindEvents();
        }
        
        bindEvents() {
          const header = this.element.querySelector('.bf-header');
          if (!header) return;

          header.addEventListener('mousedown', this.startDrag.bind(this));
          document.addEventListener('mousemove', Utils.throttle(this.drag.bind(this), 16));
          document.addEventListener('mouseup', this.stopDrag.bind(this));
          
          header.addEventListener('touchstart', this.startDrag.bind(this));
          document.addEventListener('touchmove', Utils.throttle(this.drag.bind(this), 16));
          document.addEventListener('touchend', this.stopDrag.bind(this));
        }
        
        startDrag(e) {
          this.isDragging = true;
          const clientX = e.clientX || e.touches[0].clientX;
          const clientY = e.clientY || e.touches[0].clientY;
          const rect = this.element.getBoundingClientRect();
          
          this.offset.x = clientX - rect.left;
          this.offset.y = clientY - rect.top;
          
          document.body.style.userSelect = 'none';
          this.element.style.transition = 'none';
        }
        
        drag(e) {
          if (!this.isDragging) return;
          
          const clientX = e.clientX || (e.touches && e.touches[0].clientX);
          const clientY = e.clientY || (e.touches && e.touches[0].clientY);
          
          if (!clientX || !clientY) return;
          
          let left = clientX - this.offset.x;
          let top = clientY - this.offset.y;
          
          left = Math.max(8, Math.min(window.innerWidth - this.element.offsetWidth - 8, left));
          top = Math.max(8, Math.min(window.innerHeight - this.element.offsetHeight - 8, top));
          
          this.element.style.left = left + 'px';
          this.element.style.top = top + 'px';
          this.element.style.right = 'auto';
          this.element.style.bottom = 'auto';
        }
        
        stopDrag() {
          this.isDragging = false;
          document.body.style.userSelect = '';
          this.element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    // ============================================================================
    // SISTEMA PRINCIPAL BOOKFLOW
    // ============================================================================

    console.log('🚀 BookFlow - Sistema Inteligente de Quiz');
    console.log('🔤 Sistema de tratamento de aspas ativado');

    // Funções principais do BookFlow
    function detectarLivro() {
        const tituloElement = document.querySelector('#bookTitle .truncate-text.ng-binding');
        return tituloElement ? tituloElement.textContent.trim() : null;
    }

    function verificarPopup() {
        const popup = document.querySelector('div.md-dialog-container');
        return popup && popup.querySelector('md-dialog') && popup.querySelector('.question-quiz-text');
    }

    function capturarAlternativas() {
        const popup = document.querySelector('div.md-dialog-container');
        if (!popup) return null;

        const perguntaElement = popup.querySelector('pre.question-quiz-text');
        const opcoesElements = popup.querySelectorAll('.choice-student');
        
        if (!perguntaElement) return null;

        const alternativas = Array.from(opcoesElements).map((opcao, index) => ({
            indice: index,
            texto: opcao.textContent.trim(),
            elemento: opcao
        }));

        return {
            pergunta: perguntaElement.textContent.trim(),
            alternativas: alternativas
        };
    }

    // FUNÇÃO ATUALIZADA QUE USA O SISTEMA DE TRATAMENTO DE ASPAS
    function encontrarRespostaCorreta(livro, dadosPergunta) {
        if (!livro || !bancoRespostas[livro]) return null;

        // Processa as alternativas (remove problemas com aspas para comparação)
        const alternativasProcessadas = dadosPergunta.alternativas.map(alt => ({
            ...alt,
            textoProcessado: TratamentoAspas.normalizarParaComparacao(alt.texto)
        }));

        // Processa as respostas do banco
        const respostasProcessadas = bancoRespostas[livro].map(resp => 
            TratamentoAspas.normalizarParaComparacao(TratamentoAspas.unescapeTexto(resp))
        );

        // Compara cada alternativa com cada resposta do banco
        for (let alternativa of alternativasProcessadas) {
            for (let i = 0; i < respostasProcessadas.length; i++) {
                const respostaBanco = respostasProcessadas[i];
                const respostaOriginal = bancoRespostas[livro][i];
                
                // Usa o comparador inteligente que ignora diferenças de aspas
                if (TratamentoAspas.compararComAspas(alternativa.textoProcessado, respostaBanco)) {
                    console.log('🎯 Resposta encontrada (com tratamento de aspas):', {
                        alternativaOriginal: alternativa.texto,
                        respostaOriginal: TratamentoAspas.unescapeTexto(respostaOriginal),
                        similaridade: TratamentoAspas.calcularSimilaridade(
                            alternativa.textoProcessado, 
                            respostaBanco
                        )
                    });
                    return alternativa;
                }
            }
        }
        
        // Se não encontrou com o sistema inteligente, tenta comparação direta (para respostas simples)
        for (let alternativa of alternativasProcessadas) {
            for (let respostaCorreta of bancoRespostas[livro]) {
                const respostaUnescaped = TratamentoAspas.unescapeTexto(respostaCorreta);
                if (alternativa.texto === respostaUnescaped) {
                    return alternativa;
                }
            }
        }
        
        return null;
    }

    function removerDestaqueAnterior() {
        document.querySelectorAll('.choice-student').forEach(opcao => {
            opcao.style.backgroundColor = '';
            opcao.style.border = '';
            opcao.style.padding = '';
            opcao.style.borderRadius = '';
            // Remove indicadores de similaridade
            const indicadores = opcao.querySelectorAll('.similaridade-indicador');
            indicadores.forEach(ind => ind.remove());
        });
    }

    function destacarRespostaCorreta(resposta) {
        removerDestaqueAnterior();
        resposta.elemento.style.backgroundColor = '#d4edda';
        resposta.elemento.style.border = '2px solid #28a745';
        resposta.elemento.style.padding = '5px';
        resposta.elemento.style.borderRadius = '5px';
        resposta.elemento.style.fontWeight = 'bold';
        
        // Adiciona indicador de que foi encontrada com tratamento de aspas
        const indicador = document.createElement('span');
        indicador.style.cssText = `
            font-size: 10px;
            background: #28a745;
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 8px;
            float: right;
        `;
        indicador.textContent = '🔤';
        indicador.title = 'Encontrada com tratamento de aspas';
        indicador.className = 'similaridade-indicador';
        resposta.elemento.appendChild(indicador);
    }

    function clicarProximaPagina() {
        const botao = document.querySelector('md-icon[md-svg-icon="chevron_right_big"]');
        if (botao) {
            botao.click();
            return true;
        }
        return false;
    }

    // ============================================================================
    // POPUP PRINCIPAL BOOKFLOW (CLEAN E MODERNO)
    // ============================================================================

    let controleAtivo = null;
    let intervaloClique = null;
    let popupAtivo = false;
    let ultimaPergunta = '';
    let monitorPopup = null;

    const PopupManager = {
        init() {
            this.createPopup();
            this.setupEventListeners();
            this.setupResponsiveBehavior();
            // Widgets visíveis por padrão
            this.widgetsVisible = true;
        },

        createPopup() {
            const currentMode = 'dark';
            const colors = CONFIG.darkModeColors;
            const currentWidth = Utils.getSize(380);
            const currentPadding = Utils.getSize(20);
            const currentBorderRadius = Utils.getSize(20);

            const popup = document.createElement('div');
            popup.id = 'bookflow-popup';
            popup.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: ${currentWidth}px;
                background: ${colors.surface};
                color: ${colors.text};
                padding: ${currentPadding}px;
                border-radius: ${currentBorderRadius}px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                z-index: 999999;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid ${colors.border};
                backdrop-filter: blur(10px);
                max-height: 80px;
                overflow: hidden;
            `;

            this.createHeader(popup, colors);
            
            document.body.appendChild(popup);
            this.popup = popup;

            new DragManager(popup);
        },

        createHeader(popup, colors) {
            const header = document.createElement('div');
            header.className = 'bf-header';
            header.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: ${Utils.getSize(12)}px;
                cursor: move;
                padding-bottom: ${Utils.getSize(16)}px;
                border-bottom: 1px solid ${colors.border};
            `;
            
            // Título e ícone
            const titleEl = document.createElement('div');
            titleEl.innerHTML = `
                <div style="display: flex; align-items: center; gap: ${Utils.getSize(12)}px;">
                    <div style="
                        width: ${Utils.getSize(40)}px;
                        height: ${Utils.getSize(40)}px;
                        background: ${colors.gradient};
                        border-radius: ${Utils.getSize(10)}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${Utils.getSize(20)}px;
                        color: white;
                    ">🔤</div>
                    <div>
                        <div style="font-weight: 700; font-size: ${Utils.getSize(18)}px; color: ${colors.textImportant};">
                            BookFlow Pro
                        </div>
                        <div style="font-size: ${Utils.getSize(12)}px; color: ${colors.textLight}; margin-top: ${Utils.getSize(4)}px;">
                            Sistema com Tratamento de Aspas
                        </div>
                    </div>
                </div>
            `;
            
            const controlsContainer = document.createElement('div');
            controlsContainer.style.cssText = `display: flex; gap: ${Utils.getSize(8)}px; align-items: center;`;
            
            // Botões de controle
            const botaoIniciar = this.createButton('🚀', 'Iniciar Sistema', colors.gradient);
            const botaoParar = this.createButton('⏸️', 'Parar Sistema', 'rgba(239, 68, 68, 0.2)', '#ef4444');
            const botaoRespostas = this.createButton('📋', 'Ver Respostas', 'rgba(6, 214, 160, 0.2)', colors.text);
            const botaoWidgets = this.createButton('🎁', 'Widgets', 'rgba(139, 92, 246, 0.2)', colors.text);
            const botaoAspas = this.createButton('🔤', 'Info Aspas', 'rgba(59, 130, 246, 0.2)', colors.text);
            
            controlsContainer.appendChild(botaoIniciar);
            controlsContainer.appendChild(botaoParar);
            controlsContainer.appendChild(botaoRespostas);
            controlsContainer.appendChild(botaoWidgets);
            controlsContainer.appendChild(botaoAspas);
            
            header.appendChild(titleEl);
            header.appendChild(controlsContainer);
            popup.appendChild(header);

            // Armazenar referências
            this.botaoIniciar = botaoIniciar;
            this.botaoParar = botaoParar;
            this.botaoRespostas = botaoRespostas;
            this.botaoWidgets = botaoWidgets;
            this.botaoAspas = botaoAspas;
        },

        createButton(icon, title, background, color = 'white') {
            const btn = document.createElement('button');
            btn.innerHTML = icon;
            btn.title = title;
            btn.style.cssText = `
                background: ${background};
                border: none;
                color: ${color};
                font-size: ${Utils.getSize(16)}px;
                cursor: pointer;
                width: ${Utils.getSize(40)}px;
                height: ${Utils.getSize(40)}px;
                border-radius: ${Utils.getSize(10)}px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            `;
            
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
            
            return btn;
        },

        setupEventListeners() {
            const livroAtual = detectarLivro();
            const livroNoBanco = livroAtual && bancoRespostas[livroAtual];

            // Botão Iniciar
            this.botaoIniciar.addEventListener('click', () => {
                if (!livroAtual) {
                    ToastSystem.show('❌ Nenhum livro detectado!', 3000);
                    return;
                }
                
                if (!livroNoBanco) {
                    ToastSystem.show('⚠️ Livro não encontrado no banco de dados', 3000);
                }
                
                this.iniciarAutomacao();
                ToastSystem.show('🚀 BookFlow Pro iniciado com tratamento de aspas!', 3000);
            });

            // Botão Parar
            this.botaoParar.addEventListener('click', () => {
                if (controleAtivo) {
                    this.pararAutomacao();
                    ToastSystem.show('⏸️ BookFlow parado', 3000);
                } else {
                    ToastSystem.show('ℹ️ O sistema já está parado', 2000);
                }
            });

            // Botão Ver Respostas
            this.botaoRespostas.addEventListener('click', () => {
                if (livroAtual && livroNoBanco) {
                    this.mostrarRespostasPopup();
                } else {
                    ToastSystem.show('❌ Nenhum livro ou respostas disponíveis', 3000);
                }
            });

            // Botão Widgets
            this.botaoWidgets.addEventListener('click', () => {
                const newVisibility = !this.widgetsVisible;
                this.widgetsVisible = newVisibility;
                LivePixWidgets.toggleWidgets(newVisibility);
                ToastSystem.show(newVisibility ? '🎁 Widgets visíveis' : '🎁 Widgets ocultos', 2000);
            });

            // Botão Info Aspas
            this.botaoAspas.addEventListener('click', () => {
                this.mostrarInfoAspas();
            });
        },

        iniciarAutomacao() {
            if (controleAtivo) return;
            
            const livroAtual = detectarLivro();
            console.log(`🚀 Iniciando BookFlow Pro para: ${livroAtual || 'Livro não detectado'}`);
            console.log(`🔤 Sistema de tratamento de aspas ativado`);
            
            function monitorarPopup() {
                const dadosPergunta = capturarAlternativas();
                
                if (!dadosPergunta) {
                    if (popupAtivo) {
                        console.log('👋 Popup fechado');
                        popupAtivo = false;
                        ultimaPergunta = '';
                        removerDestaqueAnterior();
                        
                        if (!intervaloClique) {
                            intervaloClique = setInterval(clicarProximaPagina, 1000);
                        }
                    }
                    return;
                }
                
                if (intervaloClique) {
                    clearInterval(intervaloClique);
                    intervaloClique = null;
                }
                
                if (dadosPergunta.pergunta !== ultimaPergunta) {
                    console.log('🆕 Nova pergunta:', dadosPergunta.pergunta);
                    ultimaPergunta = dadosPergunta.pergunta;
                    popupAtivo = true;
                    
                    const respostaCorreta = encontrarRespostaCorreta(livroAtual, dadosPergunta);
                    
                    if (respostaCorreta) {
                        console.log('🎯 Resposta encontrada (com tratamento de aspas):', respostaCorreta.texto);
                        ToastSystem.show(`✅ Resposta encontrada 🔤 (posição ${respostaCorreta.indice + 1})`, 2000, 'bottom');
                        destacarRespostaCorreta(respostaCorreta);
                    } else {
                        console.log('❌ Resposta não encontrada no banco');
                        ToastSystem.show('❌ Resposta não encontrada no banco', 2000, 'bottom');
                        removerDestaqueAnterior();
                    }
                }
            }
            
            monitorPopup = setInterval(monitorarPopup, 1000);
            
            if (!verificarPopup()) {
                intervaloClique = setInterval(clicarProximaPagina, 1000);
            } else {
                setTimeout(() => monitorarPopup(), 500);
            }
            
            controleAtivo = {
                parar: function() {
                    if (intervaloClique) clearInterval(intervaloClique);
                    if (monitorPopup) clearInterval(monitorPopup);
                    intervaloClique = null;
                    monitorPopup = null;
                    popupAtivo = false;
                    ultimaPergunta = '';
                    removerDestaqueAnterior();
                    controleAtivo = null;
                }
            };
        },

        pararAutomacao() {
            if (controleAtivo) {
                controleAtivo.parar();
            }
        },

        mostrarRespostasPopup() {
            const livroAtual = detectarLivro();
            if (!livroAtual || !bancoRespostas[livroAtual]) return;
            
            const respostas = obterRespostasParaExibicao(livroAtual);
            
            const popup = document.createElement('div');
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${CONFIG.darkModeColors.surface};
                padding: 30px;
                border-radius: 20px;
                z-index: 10000;
                width: 500px;
                max-width: 90vw;
                max-height: 70vh;
                overflow-y: auto;
                font-family: 'Inter', system-ui, sans-serif;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                border: 1px solid ${CONFIG.darkModeColors.border};
            `;
            
            popup.innerHTML = `
                <div style="margin-bottom: 25px;">
                    <h3 style="color: ${CONFIG.darkModeColors.text}; margin: 0 0 15px 0; font-size: 22px; display: flex; align-items: center; gap: 10px;">
                        <span>🔤</span> Respostas para "${livroAtual}"
                    </h3>
                    <div style="color: ${CONFIG.darkModeColors.textLight}; font-size: 14px;">
                        Total: ${respostas.length} respostas • Sistema de tratamento de aspas ativo
                    </div>
                </div>
                
                <div style="
                    background: ${CONFIG.darkModeColors.card};
                    border-radius: 14px;
                    padding: 20px;
                    max-height: 50vh;
                    overflow-y: auto;
                ">
                    ${respostas.map((resp, index) => {
                        const temAspas = /['"`'""]/.test(resp);
                        return `
                        <div style="
                            padding: 12px 16px;
                            border-bottom: 1px solid ${CONFIG.darkModeColors.border};
                            color: ${CONFIG.darkModeColors.text};
                            font-size: 14px;
                            line-height: 1.5;
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                        ">
                            <div style="
                                min-width: 28px;
                                width: 28px;
                                height: 28px;
                                background: ${temAspas ? CONFIG.darkModeColors.primary : CONFIG.darkModeColors.success};
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 13px;
                                font-weight: 700;
                                color: white;
                                flex-shrink: 0;
                            ">${index + 1}</div>
                            <div style="flex: 1;">${resp}</div>
                            ${temAspas ? '<div style="color: #f59e0b; font-size: 12px;">🔤</div>' : ''}
                        </div>
                    `}).join('')}
                </div>
                
                <button id="fechar-respostas" style="
                    margin-top: 25px;
                    background: ${CONFIG.darkModeColors.primary};
                    color: white;
                    border: none;
                    padding: 14px 24px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 600;
                    width: 100%;
                    transition: all 0.3s ease;
                ">Fechar</button>
            `;
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 35, 46, 0.8);
                backdrop-filter: blur(8px);
                z-index: 9999;
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
            
            document.getElementById('fechar-respostas').addEventListener('click', function() {
                popup.remove();
                overlay.remove();
            });
            
            overlay.addEventListener('click', function() {
                popup.remove();
                overlay.remove();
            });
        },

        mostrarInfoAspas() {
            const popup = document.createElement('div');
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${CONFIG.darkModeColors.surface};
                padding: 30px;
                border-radius: 20px;
                z-index: 10000;
                width: 450px;
                max-width: 90vw;
                max-height: 70vh;
                overflow-y: auto;
                font-family: 'Inter', system-ui, sans-serif;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                border: 1px solid ${CONFIG.darkModeColors.border};
            `;
            
            popup.innerHTML = `
                <div style="margin-bottom: 25px;">
                    <h3 style="color: ${CONFIG.darkModeColors.text}; margin: 0 0 15px 0; font-size: 22px; display: flex; align-items: center; gap: 10px;">
                        <span>🔤</span> Sistema de Tratamento de Aspas
                    </h3>
                    <div style="color: ${CONFIG.darkModeColors.textLight}; font-size: 14px;">
                        Como funciona o tratamento de aspas problemáticas
                    </div>
                </div>
                
                <div style="
                    background: ${CONFIG.darkModeColors.card};
                    border-radius: 14px;
                    padding: 20px;
                    margin-bottom: 20px;
                ">
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: ${CONFIG.darkModeColors.text}; margin: 0 0 8px 0; font-size: 16px;">
                            🔧 Problema Resolvido:
                        </h4>
                        <p style="color: ${CONFIG.darkModeColors.textLight}; font-size: 14px; margin: 0;">
                            Algumas respostas contêm aspas que quebram o código JavaScript.
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: ${CONFIG.darkModeColors.text}; margin: 0 0 8px 0; font-size: 16px;">
                            🛡️ Solução Implementada:
                        </h4>
                        <ul style="color: ${CONFIG.darkModeColors.textLight}; font-size: 14px; margin: 0; padding-left: 20px;">
                            <li>Aspas simples (') → escapadas (\\')</li>
                            <li>Aspas duplas (") → escapadas (\\")</li>
                            <li>Aspas curvas (""') → convertidas para retas</li>
                            <li>Comparação inteligente ignora aspas</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="color: ${CONFIG.darkModeColors.text}; margin: 0 0 8px 0; font-size: 16px;">
                            📊 Exemplos:
                        </h4>
                        <div style="
                            background: ${CONFIG.darkModeColors.background};
                            padding: 12px;
                            border-radius: 8px;
                            font-family: monospace;
                            font-size: 13px;
                            color: ${CONFIG.darkModeColors.text};
                        ">
                            <div>"peixe fora d'água" → "peixe fora d\\'água"</div>
                            <div>"'Raio Mortal'" → "\\'Raio Mortal\\'"</div>
                            <div>Mesmo com aspas diferentes, encontra a resposta!</div>
                        </div>
                    </div>
                </div>
                
                <button id="fechar-info" style="
                    background: ${CONFIG.darkModeColors.primary};
                    color: white;
                    border: none;
                    padding: 14px 24px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 600;
                    width: 100%;
                    transition: all 0.3s ease;
                ">Entendi</button>
            `;
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 35, 46, 0.8);
                backdrop-filter: blur(8px);
                z-index: 9999;
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
            
            document.getElementById('fechar-info').addEventListener('click', function() {
                popup.remove();
                overlay.remove();
            });
            
            overlay.addEventListener('click', function() {
                popup.remove();
                overlay.remove();
            });
        },

        setupResponsiveBehavior() {
            const mediaQuery = window.matchMedia('(max-width: 768px)');
            
            const handleMobileChange = (e) => {
                if (e.matches) {
                    this.popup.style.width = 'calc(100vw - 40px)';
                    this.popup.style.left = '20px';
                    this.popup.style.right = '20px';
                    this.popup.style.top = '20px';
                    this.popup.style.bottom = 'auto';
                } else {
                    this.popup.style.width = '380px';
                    this.popup.style.right = '20px';
                    this.popup.style.left = 'auto';
                    this.popup.style.top = '20px';
                    this.popup.style.bottom = 'auto';
                }
            };
            
            mediaQuery.addListener(handleMobileChange);
            handleMobileChange(mediaQuery);
        }
    };

    // ========== INICIALIZAÇÃO ==========
    async function init() {
        // Mostrar splash screen
        SplashScreen.show();
        
        // Inicializar widgets IMEDIATAMENTE
        LivePixWidgets.init();
        
        // Inicializar popup principal
        await Utils.delay(1000);
        PopupManager.init();
        
        // Configurar observer
        window.bookflowObserver = new MutationObserver(function(mutations) {
            const livroAtual = detectarLivro();
            if (livroAtual && bancoRespostas[livroAtual]) {
                // Atualizar estado do sistema
            }
        });

        window.bookflowObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Mostrar notificações de boas-vindas
        await Utils.delay(500);
        ToastSystem.show('🔤 BookFlow Pro carregado com sucesso!', 3000);
        
        await Utils.delay(1000);
        ToastSystem.show(`🎁 Widgets carregados automaticamente`, 3000);
        
        await Utils.delay(1000);
        ToastSystem.show(`🚀 Clique em 🚀 para iniciar com tratamento de aspas`, 3000);

        // Esconder splash screen
        await Utils.delay(1000);
        SplashScreen.hide();

        console.log(`🚀 BookFlow Pro carregado com sucesso! (${isMobile ? 'Mobile' : 'PC'})`);
        console.log(`🎁 Widgets inicializados: Donation, ${!isMobile ? 'QR, Donators' : 'QR não disponível em mobile'}`);
        console.log(`🔤 Sistema de tratamento de aspas ativado com sucesso`);
    }

    // Iniciar tudo
    init();
})();