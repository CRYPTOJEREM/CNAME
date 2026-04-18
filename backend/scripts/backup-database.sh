#!/bin/bash

# ==========================================
# Script de backup automatique de la base de données
# À exécuter via cron toutes les 6 heures
# ==========================================

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DB_FILE="$PROJECT_ROOT/database.production.json"
BACKUP_DIR="$PROJECT_ROOT/backups"
MAX_BACKUPS=28  # Garder 7 jours de backups (4 par jour)

# Créer le dossier de backups s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Vérifier que le fichier de base de données existe
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Erreur: Fichier database.production.json introuvable"
    exit 1
fi

# Générer le nom du fichier de backup avec timestamp
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/database-backup-$TIMESTAMP.json"

# Créer le backup
echo "📦 Création du backup: $BACKUP_FILE"
cp "$DB_FILE" "$BACKUP_FILE"

# Vérifier que le backup a réussi
if [ $? -eq 0 ]; then
    echo "✅ Backup créé avec succès"

    # Compter le nombre de backups
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/database-backup-*.json 2>/dev/null | wc -l)
    echo "📊 Nombre total de backups: $BACKUP_COUNT"

    # Supprimer les vieux backups si on dépasse MAX_BACKUPS
    if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
        TO_DELETE=$((BACKUP_COUNT - MAX_BACKUPS))
        echo "🗑️  Suppression de $TO_DELETE ancien(s) backup(s)..."

        ls -1t "$BACKUP_DIR"/database-backup-*.json | tail -n "$TO_DELETE" | while read -r old_backup; do
            echo "   Suppression: $(basename "$old_backup")"
            rm "$old_backup"
        done
    fi

    # Afficher l'espace disque utilisé
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    echo "💾 Espace utilisé par les backups: $BACKUP_SIZE"

    exit 0
else
    echo "❌ Erreur lors de la création du backup"
    exit 1
fi
