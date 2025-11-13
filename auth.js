class AuthManager {
    constructor() {
        this.currentStep = 'stepWelcome';
        this.phoneNumber = '';
        this.isLoading = false;
        this.timer = null;
        
        this.init();
    }

    init() {
        this.checkExistingAuth();
        this.setupEventListeners();
        this.showStep('stepWelcome');
        
        console.log('ConnectHub Auth Manager initialized');
    }

    setupEventListeners() {
        // Phone form
        document.getElementById('phoneForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePhoneSubmit();
        });

        // Verification form
        document.getElementById('verifyForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleVerification();
        });

        // Email login form
        document.getElementById('emailForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailLogin();
        });

        // Email registration form
        document.getElementById('emailRegisterForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailRegister();
        });

        // Forgot password form
        document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordReset();
        });

        // Code inputs
        this.setupCodeInputs();

        // Password toggles
        this.setupPasswordToggles();

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeStep = document.querySelector('.auth-step.active');
                const form = activeStep?.querySelector('form');
                if (form) {
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn && !submitBtn.disabled) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            }
        });
    }

    setupCodeInputs() {
        const codeInputs = document.querySelectorAll('.code-input');
        
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = value;
                
                if (value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                if (index === codeInputs.length - 1 && value) {
                    const allFilled = Array.from(codeInputs).every(input => input.value);
                    if (allFilled) {
                        document.getElementById('verifyForm')?.dispatchEvent(new Event('submit'));
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                pasteData.split('').forEach((char, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = char;
                    }
                });
                
                const lastFilledIndex = Math.min(pasteData.length - 1, 5);
                if (codeInputs[lastFilledIndex]) {
                    codeInputs[lastFilledIndex].focus();
                }
            });
        });
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    async handlePhoneSubmit() {
        if (this.isLoading) return;

        const phoneInput = document.getElementById('phoneNumber');
        const usernameInput = document.getElementById('username');
        const countryCode = document.getElementById('countryCode');
        
        const phone = phoneInput.value.trim();
        const username = usernameInput.value.trim();
        const code = countryCode.value;

        if (!this.validatePhone(phone)) {
            this.showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            phoneInput.focus();
            return;
        }

        if (!username) {
            this.showNotification('Пожалуйста, введите ваше имя', 'error');
            usernameInput.focus();
            return;
        }

        if (username.length < 2) {
            this.showNotification('Имя должно содержать至少 2 символа', 'error');
            usernameInput.focus();
            return;
        }

        this.phoneNumber = code + phone.replace(/\D/g, '');
        
        this.setLoading(true);
        
        try {
            const response = await window.connectHubAPI.sendVerificationCode(this.phoneNumber, username);
            
            if (response.success) {
                document.getElementById('verifyPhoneNumber').textContent = 
                    this.formatPhoneNumber(this.phoneNumber);
                this.showStep('stepPhoneVerify');
                this.startTimer();
                this.showNotification('Код подтверждения отправлен');
                
                // Автофокус на первое поле кода
                setTimeout(() => {
                    document.querySelector('.code-input')?.focus();
                }, 300);
            } else {
                this.showNotification(response.message, 'error');
            }
        } catch (error) {
            console.error('Send code error:', error);
            this.showNotification('Ошибка соединения. Проверьте интернет.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleVerification() {
        if (this.isLoading) return;

        const code = Array.from(document.querySelectorAll('.code-input'))
            .map(input => input.value)
            .join('');

        if (code.length !== 6) {
            this.showNotification('Пожалуйста, введите полный 6-значный код', 'error');
            return;
        }

        const username = document.getElementById('username')?.value || 'Пользователь';
        
        this.setLoading(true, 'verifyBtn');

        try {
            const response = await window.connectHubAPI.verifyPhoneCode(this.phoneNumber, code, username);
            
            if (response.success) {
                this.showNotification('Регистрация успешно завершена!', 'success');
                
                // Сохраняем данные аутентификации
                localStorage.setItem('auth_token', response.token);
                localStorage.setItem('user_data', JSON.stringify(response.user));
                localStorage.setItem('auth_method', 'phone');
                
                // Перенаправляем на дашборд
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showNotification(response.message, 'error');
                this.clearCodeInputs();
                document.querySelector('.code-input')?.focus();
            }
        } catch (error) {
            console.error('Verification error:', error);
            this.showNotification('Ошибка проверки кода', 'error');
        } finally {
            this.setLoading(false, 'verifyBtn');
        }
    }

    async handleEmailLogin() {
        if (this.isLoading) return;

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!this.validateEmail(email)) {
            this.showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }

        if (!password) {
            this.showNotification('Пожалуйста, введите пароль', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const response = await window.connectHubAPI.loginWithEmail(email, password);
            
            if (response.success) {
                this.showNotification('Вход выполнен успешно!', 'success');
                
                // Сохраняем данные аутентификации
                localStorage.setItem('auth_token', response.token);
                localStorage.setItem('user_data', JSON.stringify(response.user));
                localStorage.setItem('auth_method', 'email');
                
                if (rememberMe) {
                    localStorage.setItem('remember_me', 'true');
                }
                
                // Перенаправляем на дашборд
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showNotification(response.message, 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Ошибка входа. Проверьте подключение.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleEmailRegister() {
        if (this.isLoading) return;

        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;

        // Валидация
        if (!username || username.length < 2) {
            this.showNotification('Имя должно содержать至少 2 символа', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }

        if (password.length < 8) {
            this.showNotification('Пароль должен содержать至少 8 символов', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }

        if (!document.getElementById('acceptTerms').checked) {
            this.showNotification('Пожалуйста, примите условия использования', 'error');
            return;
        }

        this.setLoading(true);

        try {
            // В демо-режиме создаем пользователя через мок API
            const demoUser = {
                id: Date.now(),
                username: username,
                email: email,
                user_type: 'user',
                balance: 1000,
                anonymous_number: 'USER_' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                is_verified: true,
                avatar: null,
                status: 'online',
                last_seen: new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            // Сохраняем в localStorage
            const data = window.connectHubAPI.getData();
            data.users.push(demoUser);
            window.connectHubAPI.setData(data);

            const token = window.connectHubAPI.generateToken(demoUser.id);
            
            this.showNotification('Регистрация успешно завершена!', 'success');
            
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_data', JSON.stringify(demoUser));
            localStorage.setItem('auth_method', 'email');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Ошибка регистрации', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handlePasswordReset() {
        if (this.isLoading) return;

        const email = document.getElementById('resetEmail').value.trim();

        if (!this.validateEmail(email)) {
            this.showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }

        this.setLoading(true);

        try {
            // Имитация отправки email
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Ссылка для сброса пароля отправлена на ваш email', 'success');
            
            setTimeout(() => {
                this.showStep('stepEmail');
            }, 3000);
        } catch (error) {
            this.showNotification('Ошибка отправки email', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Вспомогательные методы
    validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} ${match[2]} ${match[3]}-${match[4]}-${match[5]}`;
        }
        return phone;
    }

    showStep(stepId) {
        // Скрываем все шаги
        document.querySelectorAll('.auth-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Показываем целевой шаг
        const targetStep = document.getElementById(stepId);
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepId;
            
            // Фокус на первом поле ввода
            setTimeout(() => {
                const firstInput = targetStep.querySelector('input, select');
                if (firstInput) firstInput.focus();
            }, 300);
        }
    }

    setLoading(loading, buttonId = null) {
        this.isLoading = loading;
        
        const buttons = buttonId ? 
            [document.getElementById(buttonId)] : 
            document.querySelectorAll('.auth-step.active button[type="submit"]');
        
        buttons.forEach(btn => {
            if (btn) {
                if (loading) {
                    btn.classList.add('loading');
                    btn.disabled = true;
                } else {
                    btn.classList.remove('loading');
                    btn.disabled = false;
                }
            }
        });
    }

    startTimer() {
        let timeLeft = 60;
        const timerElement = document.getElementById('countdown');
        const resendBtn = document.getElementById('resendBtn');
        const timerContainer = document.getElementById('timer');
        
        if (!timerElement || !resendBtn) return;
        
        resendBtn.disabled = true;
        resendBtn.style.opacity = '0.5';
        timerContainer.style.display = 'flex';
        
        // Очищаем предыдущий таймер
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                resendBtn.disabled = false;
                resendBtn.style.opacity = '1';
                timerContainer.style.display = 'none';
            }
        }, 1000);
    }

    async resendCode() {
        if (this.isLoading) return;
        
        const username = document.getElementById('username')?.value || 'Пользователь';
        
        this.setLoading(true);

        try {
            const response = await window.connectHubAPI.sendVerificationCode(this.phoneNumber, username);
            
            if (response.success) {
                this.showNotification('Код отправлен повторно');
                this.startTimer();
                this.clearCodeInputs();
                document.querySelector('.code-input')?.focus();
            } else {
                this.showNotification(response.message, 'error');
            }
        } catch (error) {
            this.showNotification('Ошибка отправки', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    clearCodeInputs() {
        document.querySelectorAll('.code-input').forEach(input => {
            input.value = '';
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        if (!notification || !messageEl) return;
        
        // Устанавливаем сообщение и иконку
        messageEl.textContent = message;
        
        // Устанавливаем иконку в зависимости от типа
        let iconClass;
        switch (type) {
            case 'success':
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                iconClass = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-triangle';
                break;
            case 'info':
                iconClass = 'fas fa-info-circle';
                break;
            default:
                iconClass = 'fas fa-info-circle';
        }
        iconEl.className = `notification-icon ${iconClass}`;
        
        // Показываем уведомление
        notification.className = `notification ${type} show`;
        
        // Автоскрытие
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    checkExistingAuth() {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
            // Проверяем валидность токена
            window.connectHubAPI.verifyToken(token).then(response => {
                if (response.success) {
                    // Перенаправляем на дашборд если уже аутентифицированы
                    window.location.href = 'dashboard.html';
                } else {
                    // Очищаем невалидные данные
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                }
            });
        }
    }

    // Google OAuth (заглушка для демо)
    async signInWithGoogle() {
        this.showNotification('Google OAuth будет реализован в будущем обновлении', 'info');
        
        // Демо-режим: создаем временного пользователя
        const demoUser = {
            id: Date.now(),
            username: 'Google User',
            email: 'google.user@example.com',
            user_type: 'user',
            balance: 1200,
            anonymous_number: 'USER_GOOGLE_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            is_verified: true,
            avatar: null,
            status: 'online',
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString()
        };

        const token = window.connectHubAPI.generateToken(demoUser.id);
        
        this.showNotification('Вход через Google выполнен!', 'success');
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        localStorage.setItem('auth_method', 'google');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

// Глобальные функции для HTML обработчиков
function showStep(stepId) {
    if (window.authManager) {
        window.authManager.showStep(stepId);
    }
}

function resendCode() {
    if (window.authManager) {
        window.authManager.resendCode();
    }
}

function signInWithGoogle() {
    if (window.authManager) {
        window.authManager.signInWithGoogle();
    }
}

// Демо функция для быстрого заполнения форм
function demoFillPhone() {
    document.getElementById('phoneNumber').value = '9991234567';
    document.getElementById('username').value = 'Тестовый Пользователь';
}

function demoFillEmail() {
    document.getElementById('loginEmail').value = 'demo@connecthub.com';
    document.getElementById('loginPassword').value = 'password';
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // Добавляем демо кнопки если в режиме разработки
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const style = document.createElement('style');
        style.textContent = `
            .demo-buttons {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 1000;
            }
            .demo-btn {
                padding: 8px 12px;
                background: #6366f1;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            .demo-btn:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        const demoButtons = document.createElement('div');
        demoButtons.className = 'demo-buttons';
        demoButtons.innerHTML = `
            <button class="demo-btn" onclick="demoFillPhone()">📱 Демо телефон</button>
            <button class="demo-btn" onclick="demoFillEmail()">📧 Демо email</button>
        `;
        document.body.appendChild(demoButtons);
    }
});