// ConnectHub Mock API для GitHub Pages
class ConnectHubAPI {
    constructor() {
        this.storageKey = 'connecthub_data';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.storageKey)) {
            const demoData = {
                users: [
                    {
                        id: 1,
                        phone: '+79991234567',
                        username: 'Анна Петрова',
                        user_type: 'user',
                        balance: 1500,
                        anonymous_number: 'USER_A1B2C3',
                        is_verified: true,
                        avatar: null,
                        status: 'online',
                        last_seen: new Date().toISOString(),
                        created_at: '2024-01-15T10:00:00Z'
                    },
                    {
                        id: 2,
                        username: 'Демо Пользователь',
                        email: 'demo@connecthub.com',
                        user_type: 'user',
                        balance: 2000,
                        anonymous_number: 'USER_DEMO123',
                        is_verified: true,
                        avatar: null,
                        status: 'online',
                        last_seen: new Date().toISOString(),
                        created_at: '2024-01-10T15:00:00Z'
                    }
                ],
                chats: [
                    {
                        id: 1,
                        type: 'private',
                        name: null,
                        participants: [1, 2],
                        last_message: {
                            text: 'Привет! Как дела?',
                            sender_id: 2,
                            timestamp: new Date().toISOString()
                        },
                        unread_count: 3,
                        created_at: '2024-01-15T10:00:00Z'
                    },
                    {
                        id: 2,
                        type: 'group',
                        name: 'Лучшие друзья',
                        participants: [1, 2, 3],
                        last_message: {
                            text: 'Кто сегодня вечером свободен?',
                            sender_id: 1,
                            timestamp: new Date().toISOString()
                        },
                        unread_count: 0,
                        created_at: '2024-01-12T14:00:00Z'
                    }
                ],
                groups: [
                    {
                        id: 1,
                        name: 'Лучшие друзья',
                        description: 'Группа для общения с друзьями',
                        avatar: null,
                        participants: [1, 2, 3],
                        admin_id: 1,
                        settings: {
                            slow_mode: false,
                            anonymous: false,
                            invite_only: true
                        },
                        created_at: '2024-01-10T15:00:00Z'
                    },
                    {
                        id: 2,
                        name: 'Работа',
                        description: 'Рабочие вопросы и обсуждения',
                        avatar: null,
                        participants: [1, 4, 5, 6],
                        admin_id: 4,
                        settings: {
                            slow_mode: true,
                            anonymous: false,
                            invite_only: true
                        },
                        created_at: '2024-01-08T09:00:00Z'
                    }
                ],
                messages: [
                    {
                        id: 1,
                        chat_id: 1,
                        sender_id: 2,
                        text: 'Привет! Как дела?',
                        timestamp: new Date(Date.now() - 300000).toISOString(),
                        is_read: false,
                        type: 'text'
                    },
                    {
                        id: 2,
                        chat_id: 1,
                        sender_id: 1,
                        text: 'Привет! Все отлично, спасибо! А у тебя как?',
                        timestamp: new Date(Date.now() - 180000).toISOString(),
                        is_read: true,
                        type: 'text'
                    },
                    {
                        id: 3,
                        chat_id: 2,
                        sender_id: 1,
                        text: 'Кто сегодня вечером свободен?',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        is_read: true,
                        type: 'text'
                    }
                ],
                gifts: [
                    {
                        id: 1,
                        name: 'Золотая звезда',
                        icon: 'fas fa-star',
                        price: 100,
                        category: 'popular',
                        description: 'Яркая золотая звезда за достижения',
                        is_active: true
                    },
                    {
                        id: 2,
                        name: 'Сердце',
                        icon: 'fas fa-heart',
                        price: 50,
                        category: 'love',
                        description: 'Символ любви и заботы',
                        is_active: true
                    },
                    {
                        id: 3,
                        name: 'Огненный шар',
                        icon: 'fas fa-fire',
                        price: 150,
                        category: 'special',
                        description: 'Мощный энергетический заряд',
                        is_active: true
                    },
                    {
                        id: 4,
                        name: 'Корона',
                        icon: 'fas fa-crown',
                        price: 300,
                        category: 'premium',
                        description: 'Королевский подарок для особых случаев',
                        is_active: true
                    }
                ],
                user_gifts: [
                    {
                        id: 1,
                        gift_id: 1,
                        sender_id: 2,
                        receiver_id: 1,
                        message: 'За прекрасное общение!',
                        sent_at: new Date(Date.now() - 86400000).toISOString()
                    },
                    {
                        id: 2,
                        gift_id: 2,
                        sender_id: 1,
                        receiver_id: 2,
                        message: 'Спасибо за помощь!',
                        sent_at: new Date(Date.now() - 172800000).toISOString()
                    }
                ],
                contacts: [],
                notifications: [
                    {
                        id: 1,
                        user_id: 1,
                        type: 'gift_received',
                        title: 'Новый подарок',
                        message: 'Вы получили подарок "Золотая звезда" от Анны',
                        is_read: false,
                        created_at: new Date(Date.now() - 3600000).toISOString()
                    },
                    {
                        id: 2,
                        user_id: 1,
                        type: 'friend_request',
                        title: 'Запрос в друзья',
                        message: 'Михаил отправил вам запрос в друзья',
                        is_read: true,
                        created_at: new Date(Date.now() - 7200000).toISOString()
                    }
                ]
            };
            localStorage.setItem(this.storageKey, JSON.stringify(demoData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    }

    setData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Auth methods
    async sendVerificationCode(phone, username) {
        await this.delay(1000);
        
        const data = this.getData();
        const existingUser = data.users.find(u => u.phone === phone);
        
        if (existingUser) {
            return {
                success: false,
                message: 'Номер телефона уже зарегистрирован'
            };
        }

        // В демо-режиме всегда успешно
        const verificationCode = '123456';
        sessionStorage.setItem('verification_code', verificationCode);
        sessionStorage.setItem('pending_phone', phone);
        sessionStorage.setItem('pending_username', username);

        return {
            success: true,
            message: 'Код подтверждения отправлен'
        };
    }

    async verifyPhoneCode(phone, code, username) {
        await this.delay(1500);
        
        const storedCode = sessionStorage.getItem('verification_code');
        const storedPhone = sessionStorage.getItem('pending_phone');
        
        if (phone === storedPhone && code === storedCode) {
            const data = this.getData();
            const newUser = {
                id: Date.now(),
                phone: phone,
                username: username,
                user_type: 'user',
                balance: 1000,
                anonymous_number: 'USER_' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                is_verified: true,
                avatar: null,
                status: 'online',
                last_seen: new Date().toISOString(),
                created_at: new Date().toISOString()
            };
            
            data.users.push(newUser);
            this.setData(data);
            
            // Очищаем временные данные
            sessionStorage.removeItem('verification_code');
            sessionStorage.removeItem('pending_phone');
            sessionStorage.removeItem('pending_username');
            
            return {
                success: true,
                token: this.generateToken(newUser.id),
                user: newUser
            };
        }
        
        return {
            success: false,
            message: 'Неверный код подтверждения'
        };
    }

    async loginWithEmail(email, password) {
        await this.delay(1200);
        
        // Демо учетные данные
        if (email === 'demo@connecthub.com' && password === 'password') {
            const data = this.getData();
            let demoUser = data.users.find(u => u.email === email);
            
            if (!demoUser) {
                demoUser = {
                    id: Date.now(),
                    username: 'Демо Пользователь',
                    email: email,
                    user_type: 'user',
                    balance: 1500,
                    anonymous_number: 'USER_DEMO123',
                    is_verified: true,
                    avatar: null,
                    status: 'online',
                    last_seen: new Date().toISOString(),
                    created_at: new Date().toISOString()
                };
                data.users.push(demoUser);
                this.setData(data);
            }
            
            return {
                success: true,
                token: this.generateToken(demoUser.id),
                user: demoUser
            };
        }
        
        return {
            success: false,
            message: 'Неверный email или пароль'
        };
    }

    async verifyToken(token) {
        await this.delay(500);
        
        try {
            const payload = JSON.parse(atob(token));
            const data = this.getData();
            const user = data.users.find(u => u.id === payload.userId);
            
            if (user && payload.exp > Date.now()) {
                // Обновляем статус онлайн
                user.last_seen = new Date().toISOString();
                user.status = 'online';
                this.setData(data);
                
                return {
                    success: true,
                    user: user
                };
            }
        } catch (error) {
            console.error('Token verification error:', error);
        }
        
        return {
            success: false,
            message: 'Недействительный токен'
        };
    }

    // User methods
    async getUserProfile(userId) {
        await this.delay(600);
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        
        if (user) {
            return {
                success: true,
                profile: user
            };
        }
        
        return {
            success: false,
            message: 'Пользователь не найден'
        };
    }

    async updateUserProfile(userId, updates) {
        await this.delay(800);
        const data = this.getData();
        const userIndex = data.users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            data.users[userIndex] = { ...data.users[userIndex], ...updates };
            this.setData(data);
            
            return {
                success: true,
                profile: data.users[userIndex]
            };
        }
        
        return {
            success: false,
            message: 'Пользователь не найден'
        };
    }

    // Chats methods
    async getChats(userId) {
        await this.delay(700);
        const data = this.getData();
        const userChats = data.chats.filter(chat => 
            chat.participants.includes(userId)
        );
        
        // Добавляем информацию о участниках
        const chatsWithDetails = userChats.map(chat => {
            const otherParticipants = chat.participants.filter(id => id !== userId);
            const participantDetails = otherParticipants.map(pid => 
                data.users.find(u => u.id === pid)
            ).filter(Boolean);
            
            return {
                ...chat,
                participant_details: participantDetails,
                is_online: participantDetails.some(p => p.status === 'online')
            };
        });
        
        return chatsWithDetails;
    }

    async getMessages(chatId) {
        await this.delay(500);
        const data = this.getData();
        const messages = data.messages
            .filter(msg => msg.chat_id === chatId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Добавляем информацию об отправителях
        const messagesWithSenders = messages.map(msg => {
            const sender = data.users.find(u => u.id === msg.sender_id);
            return {
                ...msg,
                sender_name: sender?.username,
                sender_anonymous: sender?.anonymous_number
            };
        });
        
        return messagesWithSenders;
    }

    async sendMessage(chatId, senderId, text, type = 'text') {
        await this.delay(300);
        const data = this.getData();
        
        const newMessage = {
            id: Date.now(),
            chat_id: chatId,
            sender_id: senderId,
            text: text,
            timestamp: new Date().toISOString(),
            is_read: false,
            type: type
        };
        
        data.messages.push(newMessage);
        
        // Обновляем последнее сообщение в чате
        const chat = data.chats.find(c => c.id === chatId);
        if (chat) {
            chat.last_message = {
                text: text,
                sender_id: senderId,
                timestamp: new Date().toISOString()
            };
            // Увеличиваем счетчик непрочитанных для других участников
            chat.participants.forEach(pid => {
                if (pid !== senderId) {
                    chat.unread_count = (chat.unread_count || 0) + 1;
                }
            });
        }
        
        this.setData(data);
        
        return {
            success: true,
            message: newMessage
        };
    }

    // Groups methods
    async getGroups(userId) {
        await this.delay(600);
        const data = this.getData();
        const userGroups = data.groups.filter(group => 
            group.participants.includes(userId)
        );
        
        return userGroups;
    }

    async createGroup(groupData) {
        await this.delay(1000);
        const data = this.getData();
        const newGroup = {
            id: Date.now(),
            ...groupData,
            created_at: new Date().toISOString()
        };
        
        data.groups.push(newGroup);
        
        // Создаем чат для группы
        const groupChat = {
            id: Date.now(),
            type: 'group',
            name: groupData.name,
            participants: groupData.participants,
            last_message: null,
            unread_count: 0,
            created_at: new Date().toISOString()
        };
        data.chats.push(groupChat);
        
        this.setData(data);
        
        return {
            success: true,
            group: newGroup,
            chat: groupChat
        };
    }

    // Gifts methods
    async getGifts() {
        await this.delay(400);
        const data = this.getData();
        return data.gifts.filter(gift => gift.is_active);
    }

    async sendGift(senderId, receiverId, giftId, message = '') {
        await this.delay(800);
        const data = this.getData();
        
        // Проверяем баланс
        const sender = data.users.find(u => u.id === senderId);
        const gift = data.gifts.find(g => g.id === giftId);
        const receiver = data.users.find(u => u.id === receiverId);
        
        if (!sender || !gift || !receiver) {
            return {
                success: false,
                message: 'Ошибка отправки подарка'
            };
        }
        
        if (sender.balance < gift.price) {
            return {
                success: false,
                message: 'Недостаточно средств'
            };
        }
        
        // Списываем средства
        sender.balance -= gift.price;
        
        const newGift = {
            id: Date.now(),
            gift_id: giftId,
            sender_id: senderId,
            receiver_id: receiverId,
            message: message,
            sent_at: new Date().toISOString()
        };
        
        data.user_gifts.push(newGift);
        
        // Создаем уведомление для получателя
        const notification = {
            id: Date.now(),
            user_id: receiverId,
            type: 'gift_received',
            title: 'Новый подарок',
            message: `Вы получили подарок "${gift.name}" от ${sender.username}`,
            is_read: false,
            created_at: new Date().toISOString()
        };
        data.notifications.push(notification);
        
        this.setData(data);
        
        return {
            success: true,
            gift: newGift,
            new_balance: sender.balance
        };
    }

    // Notifications methods
    async getNotifications(userId) {
        await this.delay(500);
        const data = this.getData();
        const userNotifications = data.notifications
            .filter(notif => notif.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        return userNotifications;
    }

    async markNotificationAsRead(notificationId) {
        await this.delay(300);
        const data = this.getData();
        const notification = data.notifications.find(n => n.id === notificationId);
        
        if (notification) {
            notification.is_read = true;
            this.setData(data);
        }
        
        return { success: true };
    }

    // Utility methods
    generateToken(userId) {
        const payload = {
            userId: userId,
            iat: Date.now(),
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        return btoa(JSON.stringify(payload));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Search methods
    async searchUsers(query) {
        await this.delay(800);
        const data = this.getData();
        const results = data.users.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.anonymous_number.toLowerCase().includes(query.toLowerCase())
        );
        
        return results.map(user => ({
            id: user.id,
            username: user.username,
            anonymous_number: user.anonymous_number,
            status: user.status,
            avatar: user.avatar
        }));
    }

    // Wallet methods
    async getWalletBalance(userId) {
        await this.delay(400);
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        
        if (user) {
            return {
                success: true,
                balance: user.balance,
                transactions: data.user_gifts
                    .filter(g => g.sender_id === userId || g.receiver_id === userId)
                    .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))
                    .slice(0, 10)
            };
        }
        
        return {
            success: false,
            message: 'Пользователь не найден'
        };
    }

    // Admin methods (для будущего расширения)
    async getAdminStats() {
        await this.delay(1000);
        const data = this.getData();
        
        return {
            total_users: data.users.length,
            total_chats: data.chats.length,
            total_groups: data.groups.length,
            total_gifts_sent: data.user_gifts.length,
            active_today: data.users.filter(u => 
                new Date(u.last_seen).toDateString() === new Date().toDateString()
            ).length
        };
    }
}

// Инициализация глобального API
window.connectHubAPI = new ConnectHubAPI();

// Глобальные хелперы
window.demoHelpers = {
    // Быстрое создание тестового пользователя
    createTestUser: (username = 'Тестовый Пользователь') => {
        const api = window.connectHubAPI;
        const data = api.getData();
        
        const testUser = {
            id: Date.now(),
            username: username,
            user_type: 'user',
            balance: 1000,
            anonymous_number: 'USER_TEST_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            is_verified: true,
            avatar: null,
            status: 'online',
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        
        data.users.push(testUser);
        api.setData(data);
        
        return testUser;
    },
    
    // Очистка всех данных
    clearAllData: () => {
        localStorage.removeItem('connecthub_data');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_method');
        localStorage.removeItem('remember_me');
        
        sessionStorage.clear();
        
        window.location.reload();
    },
    
    // Генерация тестовых сообщений
    generateTestMessages: (chatId, count = 10) => {
        const api = window.connectHubAPI;
        const data = api.getData();
        const users = data.users;
        
        for (let i = 0; i < count; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const messages = [
                'Привет! Как дела?',
                'Что нового?',
                'Отличная погода сегодня!',
                'Смотрел новый фильм?',
                'Как твои успехи?',
                'Давай встретимся на выходных',
                'Получил твое сообщение, спасибо!',
                'Как прошел твой день?',
                'Есть интересные новости?',
                'Спасибо за помощь!'
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            data.messages.push({
                id: Date.now() + i,
                chat_id: chatId,
                sender_id: randomUser.id,
                text: randomMessage,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                is_read: Math.random() > 0.5,
                type: 'text'
            });
        }
        
        api.setData(data);
    }
};

console.log('ConnectHub API initialized successfully');