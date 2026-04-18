# Script de Backup Automatique

## 📦 Installation sur le serveur

### 1. Rendre le script exécutable

```bash
cd /var/www/lasphere/backend/scripts
chmod +x backup-database.sh
```

### 2. Tester le script manuellement

```bash
./backup-database.sh
```

Vous devriez voir :
```
📦 Création du backup: /var/www/lasphere/backend/backups/database-backup-YYYYMMDD-HHMMSS.json
✅ Backup créé avec succès
📊 Nombre total de backups: 1
💾 Espace utilisé par les backups: 16K
```

### 3. Configurer le cron job (backup toutes les 6 heures)

Éditer la crontab :
```bash
crontab -e
```

Ajouter cette ligne (backup à 00h, 06h, 12h, 18h) :
```cron
0 */6 * * * /var/www/lasphere/backend/scripts/backup-database.sh >> /var/www/lasphere/backend/logs/backup.log 2>&1
```

**OU** pour un backup toutes les heures :
```cron
0 * * * * /var/www/lasphere/backend/scripts/backup-database.sh >> /var/www/lasphere/backend/logs/backup.log 2>&1
```

**OU** pour un backup quotidien à 3h du matin :
```cron
0 3 * * * /var/www/lasphere/backend/scripts/backup-database.sh >> /var/www/lasphere/backend/logs/backup.log 2>&1
```

### 4. Créer le dossier de logs

```bash
mkdir -p /var/www/lasphere/backend/logs
```

### 5. Vérifier que le cron fonctionne

Vérifier les cron jobs actifs :
```bash
crontab -l
```

Vérifier les logs de backup :
```bash
tail -f /var/www/lasphere/backend/logs/backup.log
```

## 📂 Gestion des Backups

### Lister les backups

```bash
ls -lth /var/www/lasphere/backend/backups/
```

### Restaurer un backup

```bash
# 1. Arrêter le serveur
pm2 stop lasphere-backend

# 2. Backup actuel (sécurité)
cp /var/www/lasphere/backend/database.production.json /var/www/lasphere/backend/database.production.BEFORE_RESTORE.json

# 3. Restaurer le backup
cp /var/www/lasphere/backend/backups/database-backup-YYYYMMDD-HHMMSS.json /var/www/lasphere/backend/database.production.json

# 4. Redémarrer le serveur
pm2 restart lasphere-backend
```

### Supprimer tous les backups (⚠️ ATTENTION)

```bash
rm /var/www/lasphere/backend/backups/database-backup-*.json
```

## 🔧 Configuration

Le script garde par défaut **28 backups** (7 jours avec 4 backups/jour).

Pour modifier ce nombre, éditer la ligne dans `backup-database.sh` :
```bash
MAX_BACKUPS=28  # Modifier cette valeur
```

## 📊 Monitoring

### Vérifier l'espace disque

```bash
df -h /var/www/lasphere
```

### Vérifier la taille des backups

```bash
du -sh /var/www/lasphere/backend/backups/
```

### Derniers backups créés

```bash
ls -lt /var/www/lasphere/backend/backups/ | head -n 5
```

## 🚨 Troubleshooting

### Le script ne s'exécute pas

Vérifier les permissions :
```bash
ls -la /var/www/lasphere/backend/scripts/backup-database.sh
# Doit être : -rwxr-xr-x (exécutable)
```

### Les backups ne sont pas créés

Vérifier les logs :
```bash
cat /var/www/lasphere/backend/logs/backup.log
```

Tester manuellement :
```bash
/var/www/lasphere/backend/scripts/backup-database.sh
```

### Cron ne s'exécute pas

Vérifier le service cron :
```bash
systemctl status cron
```

Redémarrer cron si nécessaire :
```bash
systemctl restart cron
```
