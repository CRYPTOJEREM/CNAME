const { Telegraf, Markup } = require('telegraf');
const { v4: uuidv4 } = require('uuid');
const { findUserByEmail } = require('./userService');
const { loadDB, addToCollection } = require('../config/database');

class TelegramBotService {
    constructor(token, vipGroupId) {
        this.bot = new Telegraf(token);
        this.vipGroupId = vipGroupId;
        this.surveyState = new Map(); // chatId -> { step, answers }
        this.setupCommands();
        this.setupHandlers();
    }

    setupCommands() {
        // ==========================================
        // COMMANDE /start - Message d'accueil
        // ==========================================
        this.bot.command('start', async (ctx) => {
            const userName = ctx.from.first_name;

            if (ctx.chat.type === 'private') {
                // ── DM : message de bienvenue ──
                await ctx.reply(
                    `🌐 *LA SPHERE — Communauté Trading*\n` +
                    `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n` +
                    `Hey *${userName}* ! 👋\n\n` +
                    `Bienvenue dans la communauté *La Sphere*.\n` +
                    `Ici on partage nos analyses, nos trades et on progresse ensemble.\n\n` +
                    `🔹 *Ce que tu débloques :*\n\n` +
                    `    📈  Signaux & analyses de marché\n` +
                    `    🎓  Formations trading (débutant → avancé)\n` +
                    `    💎  Accès au groupe VIP privé\n` +
                    `    🏆  Concours *$1,000* chaque semaine\n\n` +
                    `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
                    `💡 _Réponds au questionnaire ci-dessous pour_\n` +
                    `_participer gratuitement au tirage hebdomadaire !_`,
                    {
                        parse_mode: 'Markdown',
                        ...Markup.inlineKeyboard([
                            [Markup.button.url('🌐 Visiter lasphere.xyz', process.env.FRONTEND_URL || 'http://localhost:5173')],
                            [Markup.button.callback('📋 Nos abonnements', 'show_plans'), Markup.button.callback('💬 Support', 'support')]
                        ])
                    }
                );

                // Lancer le questionnaire apres le welcome
                setTimeout(() => {
                    this.surveyState.set(ctx.from.id, { step: 1, answers: {} });
                    ctx.reply(
                        `🏆 *CONCOURS GRATUIT — $1,000/semaine*\n` +
                        `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n` +
                        `Réponds à 2 questions rapides pour t'inscrire au tirage hebdomadaire de *$1,000 de coupon trading Bitunix* !\n\n` +
                        `❓ *Question 1/2 — Comment tu nous as connu ?*`,
                        {
                            parse_mode: 'Markdown',
                            ...Markup.inlineKeyboard([
                                [Markup.button.callback('🎥 YouTube', 'survey_source_youtube'), Markup.button.callback('🐦 Twitter/X', 'survey_source_twitter')],
                                [Markup.button.callback('🎵 TikTok', 'survey_source_tiktok'), Markup.button.callback('👥 Un ami', 'survey_source_friend')],
                                [Markup.button.callback('🔗 Autre', 'survey_source_other')]
                            ])
                        }
                    );
                }, 2000);
            } else {
                // ── GROUPE : supprimer la commande, ne rien poster ──
                await ctx.deleteMessage().catch(() => {});
            }
        });

        // ==========================================
        // COMMANDE /help - Liste des commandes
        // ==========================================
        this.bot.command('help', (ctx) => {
            ctx.reply(
                `📚 *Commandes disponibles:*\n\n` +
                `👤 *Utilisateur:*\n` +
                `/start - Message d'accueil\n` +
                `/help - Voir cette aide\n` +
                `/status - Vérifier votre statut d'abonnement\n` +
                `/abonnements - Voir les plans disponibles\n` +
                `/support - Contacter le support\n` +
                `/moncompte - Lien vers votre espace membre\n\n` +
                `💎 *VIP uniquement:*\n` +
                `/formations - Accéder aux formations\n` +
                `/signaux - Recevoir les signaux de trading\n` +
                `/analyse - Analyses de marché quotidiennes\n\n` +
                `⚙️ *Admin:*\n` +
                `/stats - Statistiques du groupe\n` +
                `/broadcast - Envoyer un message à tous\n` +
                `/check @username - Vérifier un utilisateur`,
                { parse_mode: 'Markdown' }
            );
        });

        // ==========================================
        // COMMANDE /status - Vérifier l'abonnement
        // ==========================================
        this.bot.command('status', async (ctx) => {
            const username = ctx.from.username;

            if (!username) {
                return ctx.reply(
                    '⚠️ Vous devez avoir un pseudo Telegram pour utiliser cette commande.\n\n' +
                    'Configurez un pseudo dans: Paramètres → Modifier le profil → Pseudo'
                );
            }

            try {
                // Chercher l'utilisateur dans la base de données
                const db = loadDB();
                const payment = db.payments.find(p =>
                    p.telegramUsername === username &&
                    p.status === 'completed'
                );

                if (payment) {
                    const statusEmoji = {
                        'premium': '⭐',
                        'vip': '💎'
                    };

                    ctx.reply(
                        `✅ *Statut de votre abonnement*\n\n` +
                        `${statusEmoji[payment.planId] || '📦'} Plan: *${payment.planName}*\n` +
                        `💰 Montant: $${payment.price}\n` +
                        `📅 Date d'achat: ${new Date(payment.createdAt).toLocaleDateString('fr-FR')}\n` +
                        `🎯 Statut: ${payment.telegramAdded ? '✅ Actif dans le groupe VIP' : '⏳ En cours d\'activation'}\n\n` +
                        `🌐 Accédez à votre espace membre: ${process.env.FRONTEND_URL}/membre`,
                        {
                            parse_mode: 'Markdown',
                            ...Markup.inlineKeyboard([
                                [Markup.button.url('🚀 Aller à l\'espace membre', `${process.env.FRONTEND_URL}?tab=membre`)]
                            ])
                        }
                    );
                } else {
                    ctx.reply(
                        `❌ *Aucun abonnement trouvé*\n\n` +
                        `Il semblerait que vous n'ayez pas encore d'abonnement actif.\n\n` +
                        `📋 Consultez nos plans disponibles avec /abonnements\n` +
                        `🌐 Ou visitez: ${process.env.FRONTEND_URL}`,
                        {
                            parse_mode: 'Markdown',
                            ...Markup.inlineKeyboard([
                                [Markup.button.url('💎 Voir les abonnements', `${process.env.FRONTEND_URL}?tab=abonnements`)]
                            ])
                        }
                    );
                }
            } catch (error) {
                console.error('Erreur status:', error);
                ctx.reply('❌ Erreur lors de la vérification de votre statut. Contactez le support.');
            }
        });

        // ==========================================
        // COMMANDE /abonnements - Voir les plans
        // ==========================================
        this.bot.command('abonnements', (ctx) => {
            ctx.reply(
                `💎 *Nos Abonnements Premium*\n\n` +
                `⭐ *PREMIUM* - $29.99/mois\n` +
                `• Accès au calendrier économique avancé\n` +
                `• Dashboard crypto en temps réel\n` +
                `• Formations de base\n` +
                `• Support prioritaire\n\n` +
                `💎 *VIP* - $49.99/mois\n` +
                `• Tout Premium +\n` +
                `• Groupe Telegram VIP exclusif\n` +
                `• Signaux de trading en temps réel\n` +
                `• Analyses de marché quotidiennes\n` +
                `• Formations avancées\n` +
                `• Webinaires hebdomadaires\n` +
                `• Support VIP 24/7\n\n` +
                `🌐 Choisissez votre plan sur notre site!`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('🚀 S\'abonner maintenant', `${process.env.FRONTEND_URL}?tab=abonnements`)]
                    ])
                }
            );
        });

        // ==========================================
        // COMMANDE /support - Contacter le support
        // ==========================================
        this.bot.command('support', (ctx) => {
            ctx.reply(
                `💬 *Support La Sphere*\n\n` +
                `Besoin d'aide? Nous sommes là pour vous!\n\n` +
                `📧 Email: support@lasphere.com\n` +
                `💬 Telegram: @LaSphereSupport\n` +
                `🌐 Site: ${process.env.FRONTEND_URL}\n\n` +
                `⏰ Disponibilité:\n` +
                `Lun-Ven: 9h-19h (GMT+1)\n` +
                `Sam: 10h-16h\n` +
                `Dim: Fermé`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('📧 Ouvrir un ticket', `${process.env.FRONTEND_URL}?tab=assistance`)]
                    ])
                }
            );
        });

        // ==========================================
        // COMMANDE /moncompte - Lien espace membre
        // ==========================================
        this.bot.command('moncompte', (ctx) => {
            ctx.reply(
                `👤 *Votre Espace Membre*\n\n` +
                `Accédez à votre espace personnel pour:\n\n` +
                `📚 Consulter vos formations\n` +
                `💎 Voir votre abonnement\n` +
                `📊 Historique de paiements\n` +
                `⚙️ Gérer vos paramètres\n\n` +
                `Cliquez sur le bouton ci-dessous:`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('🚀 Accéder à mon compte', `${process.env.FRONTEND_URL}?tab=membre`)]
                    ])
                }
            );
        });

        // ==========================================
        // COMMANDES VIP (dans le groupe uniquement)
        // ==========================================
        this.bot.command('formations', async (ctx) => {
            if (ctx.chat.id.toString() !== this.vipGroupId) {
                return ctx.reply('Cette commande est réservée au groupe VIP.');
            }

            ctx.reply(
                `📚 *Formations Disponibles*\n\n` +
                `1️⃣ Trading Crypto Débutant\n` +
                `2️⃣ Analyse Technique Avancée\n` +
                `3️⃣ Stratégies de Swing Trading\n` +
                `4️⃣ Gestion du Risque\n` +
                `5️⃣ Trading Algorithmique\n\n` +
                `Accédez aux formations sur votre espace membre:`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('📚 Voir les formations', `${process.env.FRONTEND_URL}?tab=membre`)]
                    ])
                }
            );
        });

        this.bot.command('signaux', async (ctx) => {
            if (ctx.chat.id.toString() !== this.vipGroupId) {
                return ctx.reply('Cette commande est réservée au groupe VIP.');
            }

            ctx.reply(
                `📊 *Signaux de Trading du Jour*\n\n` +
                `🔴 BTC/USDT\n` +
                `Entrée: $42,500\n` +
                `TP1: $43,200 ✅\n` +
                `TP2: $44,000\n` +
                `SL: $41,800\n\n` +
                `🟢 ETH/USDT\n` +
                `Entrée: $2,250\n` +
                `TP1: $2,320\n` +
                `TP2: $2,400\n` +
                `SL: $2,180\n\n` +
                `⚠️ Utilisez toujours un stop-loss!\n\n` +
                `Plus de détails dans votre espace membre.`,
                { parse_mode: 'Markdown' }
            );
        });

        this.bot.command('analyse', async (ctx) => {
            if (ctx.chat.id.toString() !== this.vipGroupId) {
                return ctx.reply('Cette commande est réservée au groupe VIP.');
            }

            ctx.reply(
                `📈 *Analyse de Marché Quotidienne*\n\n` +
                `🗓️ ${new Date().toLocaleDateString('fr-FR')}\n\n` +
                `📊 *Bitcoin (BTC)*\n` +
                `Tendance: 🟢 Haussière\n` +
                `Support: $41,800\n` +
                `Résistance: $44,000\n\n` +
                `💎 *Ethereum (ETH)*\n` +
                `Tendance: 🟢 Haussière\n` +
                `Support: $2,180\n` +
                `Résistance: $2,400\n\n` +
                `📌 *Conclusion*\n` +
                `Le marché reste haussier avec des volumes solides.\n` +
                `Attendez les confirmations avant d'entrer en position.\n\n` +
                `Analyse complète disponible sur votre espace membre.`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('📊 Voir l\'analyse complète', `${process.env.FRONTEND_URL}?tab=membre`)]
                    ])
                }
            );
        });

        // ==========================================
        // COMMANDES ADMIN
        // ==========================================
        this.bot.command('stats', async (ctx) => {
            // Vérifier si l'utilisateur est admin
            if (!await this.isAdmin(ctx)) {
                return ctx.reply('❌ Cette commande est réservée aux administrateurs.');
            }

            try {
                const db = loadDB();
                const totalPayments = db.payments.length;
                const completedPayments = db.payments.filter(p => p.status === 'completed').length;
                const totalRevenue = db.payments
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + p.price, 0);

                const groupInfo = await this.bot.telegram.getChat(this.vipGroupId);
                const memberCount = await this.bot.telegram.getChatMemberCount(this.vipGroupId);

                ctx.reply(
                    `📊 *Statistiques La Sphere*\n\n` +
                    `👥 *Groupe VIP*\n` +
                    `Membres: ${memberCount}\n` +
                    `Nom: ${groupInfo.title}\n\n` +
                    `💰 *Paiements*\n` +
                    `Total: ${totalPayments}\n` +
                    `Confirmés: ${completedPayments}\n` +
                    `Revenus: $${totalRevenue.toFixed(2)}\n\n` +
                    `👤 *Utilisateurs*\n` +
                    `Total: ${db.users?.length || 0}\n` +
                    `Vérifiés: ${db.users?.filter(u => u.emailVerified).length || 0}`,
                    { parse_mode: 'Markdown' }
                );
            } catch (error) {
                console.error('Erreur stats:', error);
                ctx.reply('❌ Erreur lors de la récupération des statistiques.');
            }
        });

        this.bot.command('check', async (ctx) => {
            if (!await this.isAdmin(ctx)) {
                return ctx.reply('❌ Cette commande est réservée aux administrateurs.');
            }

            const args = ctx.message.text.split(' ');
            if (args.length < 2) {
                return ctx.reply('Usage: /check @username');
            }

            const username = args[1].replace('@', '');
            const db = loadDB();
            const payment = db.payments.find(p =>
                p.telegramUsername === username &&
                p.status === 'completed'
            );

            if (payment) {
                ctx.reply(
                    `✅ *Utilisateur trouvé*\n\n` +
                    `👤 Username: @${username}\n` +
                    `📦 Plan: ${payment.planName}\n` +
                    `💰 Montant: $${payment.price}\n` +
                    `📅 Date: ${new Date(payment.createdAt).toLocaleDateString('fr-FR')}\n` +
                    `🎯 Statut groupe: ${payment.telegramAdded ? '✅ Ajouté' : '❌ Non ajouté'}`,
                    { parse_mode: 'Markdown' }
                );
            } else {
                ctx.reply(`❌ Aucun paiement trouvé pour @${username}`);
            }
        });
    }

    setupHandlers() {
        // ==========================================
        // GESTION DES NOUVEAUX MEMBRES
        // ==========================================
        this.bot.on('new_chat_members', async (ctx) => {
            const newMembers = ctx.message.new_chat_members;
            const isVipGroup = ctx.chat.id.toString() === this.vipGroupId;

            for (const member of newMembers) {
                if (member.is_bot) continue;

                // Toujours envoyer en DM, jamais dans le groupe
                try {
                    if (isVipGroup) {
                        await ctx.telegram.sendMessage(
                            member.id,
                            `💎 *BIENVENUE DANS LE GROUPE VIP*\n` +
                            `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n` +
                            `Hey *${member.first_name}* ! 🎉\n\n` +
                            `Tu fais maintenant partie de l'élite La Sphere.\n\n` +
                            `🔹 *Tes avantages VIP :*\n\n` +
                            `    📊  Signaux de trading en temps réel\n` +
                            `    📈  Analyses de marché quotidiennes\n` +
                            `    🎓  Formations avancées\n` +
                            `    🏆  Concours $1,000/semaine\n` +
                            `    💬  Support VIP prioritaire\n\n` +
                            `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
                            `📌 _Tape_ /help _dans le groupe pour voir les commandes._`,
                            {
                                parse_mode: 'Markdown',
                                ...Markup.inlineKeyboard([
                                    [Markup.button.url('🚀 Mon espace membre', `${process.env.FRONTEND_URL || 'http://localhost:5173'}?tab=membre`)]
                                ])
                            }
                        );
                    } else {
                        await ctx.telegram.sendMessage(
                            member.id,
                            `🌐 *LA SPHERE — Communauté Trading*\n` +
                            `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n` +
                            `Hey *${member.first_name}* ! 👋\n\n` +
                            `Tu viens de rejoindre notre communauté, bienvenue !\n\n` +
                            `🏆 *CONCOURS GRATUIT — $1,000/semaine*\n` +
                            `Chaque semaine on tire au sort un gagnant qui remporte *$1,000 de coupon trading Bitunix* !\n\n` +
                            `Pour participer, il te suffit de répondre à *2 questions rapides* 👇`,
                            {
                                parse_mode: 'Markdown',
                                ...Markup.inlineKeyboard([
                                    [Markup.button.callback('🚀 Participer au concours', 'start_survey_dm')]
                                ])
                            }
                        );
                    }
                } catch (e) {
                    // DM impossible - l'utilisateur n'a pas encore parlé au bot
                    // On ne poste rien dans le groupe
                    console.log(`⚠️ Impossible d'envoyer un DM à ${member.first_name} (${member.id})`);
                }
            }
        });

        // ==========================================
        // GESTION DES MEMBRES QUITTANT LE GROUPE
        // ==========================================
        this.bot.on('left_chat_member', async (ctx) => {
            if (ctx.chat.id.toString() !== this.vipGroupId) return;

            const leftMember = ctx.message.left_chat_member;
            if (leftMember.is_bot) return;

            console.log(`👋 Membre quitté: @${leftMember.username || leftMember.first_name}`);
        });

        // ==========================================
        // GESTION DES BOUTONS INLINE
        // ==========================================
        this.bot.action('show_plans', (ctx) => {
            ctx.answerCbQuery();
            ctx.reply(
                `💎 *Nos Abonnements Premium*\n\n` +
                `⭐ PREMIUM - $29.99/mois\n` +
                `💎 VIP - $49.99/mois\n\n` +
                `Cliquez ci-dessous pour choisir:`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('🚀 S\'abonner', `${process.env.FRONTEND_URL}?tab=abonnements`)]
                    ])
                }
            );
        });

        this.bot.action('support', (ctx) => {
            ctx.answerCbQuery();
            ctx.reply(
                `💬 *Contactez le Support*\n\n` +
                `Email: support@lasphere.com\n` +
                `Telegram: @LaSphereSupport`,
                { parse_mode: 'Markdown' }
            );
        });

        // ==========================================
        // BOUTON "Commencer le questionnaire" en DM
        // ==========================================
        this.bot.action('start_survey_dm', (ctx) => {
            ctx.answerCbQuery();
            this.surveyState.set(ctx.from.id, { step: 1, answers: {} });
            ctx.reply(
                `📋 *Questionnaire rapide* (2 questions)\n\n` +
                `*Question 1/2* — D'où viens-tu ?`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('🎥 YouTube', 'survey_source_youtube'), Markup.button.callback('🐦 Twitter', 'survey_source_twitter')],
                        [Markup.button.callback('🎵 TikTok', 'survey_source_tiktok'), Markup.button.callback('👥 Ami', 'survey_source_friend')],
                        [Markup.button.callback('🔗 Autre', 'survey_source_other')]
                    ])
                }
            );
        });

        // ==========================================
        // QUESTIONNAIRE SURVEY
        // ==========================================
        const sourceLabels = {
            youtube: 'YouTube', twitter: 'Twitter', tiktok: 'TikTok',
            friend: 'Ami / Bouche à oreille', other: 'Autre'
        };

        ['youtube', 'twitter', 'tiktok', 'friend', 'other'].forEach(source => {
            this.bot.action(`survey_source_${source}`, (ctx) => {
                ctx.answerCbQuery();
                const state = this.surveyState.get(ctx.from.id);
                if (!state || state.step !== 1) return;

                state.answers.source = sourceLabels[source];
                state.step = 2;
                this.surveyState.set(ctx.from.id, state);

                ctx.reply(
                    `✅ Parfait !\n\n` +
                    `❓ *Question 2/2 — Ton UID Bitunix ?*\n\n` +
                    `Envoie-moi ton UID (6 à 12 chiffres).\n\n` +
                    `📍 _Où le trouver : Bitunix → Paramètres → Profil_\n` +
                    `🔗 _Pas encore de compte ?_ [Créer un compte Bitunix](https://www.bitunix.com)`,
                    { parse_mode: 'Markdown', disable_web_page_preview: true }
                );
            });
        });

        // Handler texte pour recevoir le UID Bitunix (step 2)
        this.bot.on('text', (ctx) => {
            if (ctx.chat.type !== 'private') return;

            const state = this.surveyState.get(ctx.from.id);
            if (!state || state.step !== 2) return;

            const uid = ctx.message.text.trim();

            if (!/^\d{6,12}$/.test(uid)) {
                return ctx.reply('⚠️ Le UID Bitunix doit contenir entre 6 et 12 chiffres. Veuillez reessayer:');
            }

            // Sauvegarder le survey
            const survey = {
                id: uuidv4(),
                telegramUserId: ctx.from.id,
                telegramUsername: ctx.from.username || null,
                telegramFirstName: ctx.from.first_name || null,
                source: state.answers.source,
                bitunixUid: uid,
                linkedUserId: null,
                createdAt: new Date().toISOString()
            };

            // Tenter de lier au compte utilisateur
            if (ctx.from.username) {
                const db = loadDB();
                const matchedUser = (db.users || []).find(u =>
                    u.telegramUsername && u.telegramUsername.replace('@', '') === ctx.from.username
                );
                if (matchedUser) {
                    survey.linkedUserId = matchedUser.id;
                }
            }

            addToCollection('telegramSurveys', survey);
            this.surveyState.delete(ctx.from.id);

            ctx.reply(
                `✅ *INSCRIPTION CONFIRMÉE*\n` +
                `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n` +
                `Merci *${ctx.from.first_name}* ! Tu es inscrit(e) 🎉\n\n` +
                `🏆 *Concours $1,000/semaine*\n` +
                `Tu participes automatiquement à chaque tirage hebdomadaire pour gagner *$1,000 de coupon trading Bitunix*.\n\n` +
                `⚠️ *Condition d'éligibilité :*\n` +
                `Ton compte Bitunix doit être actif — c'est-à-dire que tu dois trader dessus régulièrement.\n\n` +
                `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
                `📌 _Crée aussi ton compte sur le site pour accéder aux formations et au contenu exclusif !_`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('🌐 Créer mon compte La Sphere', process.env.FRONTEND_URL || 'http://localhost:5173')],
                        [Markup.button.url('📊 Ouvrir Bitunix', 'https://www.bitunix.com')]
                    ])
                }
            );
        });

        // ==========================================
        // GESTION DES ERREURS
        // ==========================================
        this.bot.catch((err, ctx) => {
            console.error('Erreur bot Telegram:', err);
            ctx.reply('❌ Une erreur est survenue. Réessayez plus tard.');
        });
    }

    // ==========================================
    // MÉTHODES UTILITAIRES
    // ==========================================

    async isAdmin(ctx) {
        try {
            const admins = await this.bot.telegram.getChatAdministrators(ctx.chat.id);
            return admins.some(admin => admin.user.id === ctx.from.id);
        } catch {
            return false;
        }
    }

    async sendInviteLink(username, planName) {
        try {
            const chatId = `@${username}`;

            // Créer un lien d'invitation unique
            const inviteLink = await this.bot.telegram.createChatInviteLink(
                this.vipGroupId,
                {
                    member_limit: 1,
                    expire_date: Math.floor(Date.now() / 1000) + 86400 // 24h
                }
            );

            // Envoyer le message avec le lien
            await this.bot.telegram.sendMessage(
                chatId,
                `🎉 *Félicitations!*\n\n` +
                `Votre paiement pour le plan *${planName}* a été confirmé!\n\n` +
                `💎 Cliquez sur le lien ci-dessous pour rejoindre notre groupe VIP exclusif:\n\n` +
                `${inviteLink.invite_link}\n\n` +
                `⏰ Ce lien expire dans 24h.\n\n` +
                `🌐 Accédez également à votre espace membre:\n` +
                `${process.env.FRONTEND_URL}?tab=membre`,
                {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('💎 Rejoindre le groupe VIP', inviteLink.invite_link)],
                        [Markup.button.url('🚀 Espace membre', `${process.env.FRONTEND_URL}?tab=membre`)]
                    ])
                }
            );

            console.log(`✅ Lien d'invitation envoyé à @${username}`);
            return true;
        } catch (error) {
            console.error(`❌ Erreur envoi invitation à @${username}:`, error.message);
            throw error;
        }
    }

    async notifyAdmins(message) {
        try {
            await this.bot.telegram.sendMessage(
                this.vipGroupId,
                `🔔 *Notification Admin*\n\n${message}`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.error('Erreur notification admin:', error);
        }
    }

    launch() {
        this.bot.launch().catch(err => {
            console.error('❌ Bot Telegram - échec de démarrage:', err.message);
            console.error('⚠️ Le serveur continue sans le bot Telegram');
        });
        console.log('🔄 Bot Telegram en cours de démarrage...');
    }

    stop(signal) {
        try {
            this.bot.stop(signal);
        } catch (err) {
            // Bot pas démarré, on ignore
        }
    }
}

module.exports = TelegramBotService;
