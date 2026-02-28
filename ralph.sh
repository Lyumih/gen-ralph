#!/usr/bin/env bash
# Ralph — оркестратор задач для проекта Gen (Browser Mage RPG).
# Работает с Cursor Agent CLI, поддерживает Windows (Git Bash/WSL) и macOS/Linux.
set -e

TASKS_FILE="tasks.json"
PRD_FILE="PRD-BrowserMageRPG-2026-02-28.md"
PROGRESS_FILE="progress.md"

# Проверка pending: в tasks.json статус в формате "status":"pending"
count_pending() {
    grep -c '"status"[[:space:]]*:[[:space:]]*"pending"' "$TASKS_FILE" 2>/dev/null || echo "0"
}

count_done() {
    grep -c '"status"[[:space:]]*:[[:space:]]*"done"' "$TASKS_FILE" 2>/dev/null || echo "0"
}

has_pending_tasks() {
    local pending
    pending=$(count_pending)
    [[ "$pending" -gt 0 ]]
}

# Выбор агента: Cursor (agent), Claude, Codex.
# RALPH_AGENT=cursor|claude|codex — принудительно.
# Иначе: при наличии команды agent (Cursor CLI) — cursor, иначе claude, иначе codex.
resolve_agent() {
    if [[ -n "${RALPH_AGENT:-}" ]]; then
        case "$RALPH_AGENT" in
            cursor|claude|codex) echo "$RALPH_AGENT"; return 0 ;;
            *) echo "Unsupported RALPH_AGENT: $RALPH_AGENT" >&2; return 1 ;;
        esac
    fi
    if command -v agent &>/dev/null; then
        echo "cursor"
        return 0
    fi
    if command -v claude &>/dev/null; then
        echo "claude"
        return 0
    fi
    if command -v codex &>/dev/null; then
        echo "codex"
        return 0
    fi
    return 1
}

run_agent() {
    local agent="$1"
    local prompt="$2"

    case "$agent" in
        cursor)
            # Cursor Agent CLI: --print для вывода в консоль, --trust для headless
            agent -p --trust --workspace "$(pwd)" -- "$prompt"
            ;;
        claude)
            claude --permission-mode acceptEdits -p "$prompt"
            ;;
        codex)
            local output_file
            output_file=$(mktemp 2>/dev/null || echo "${TMPDIR:-/tmp}/ralph_codex.$$.tmp")
            codex exec --full-auto --color never -C "$(pwd)" --output-last-message "$output_file" "$prompt" >/dev/null
            cat "$output_file"
            rm -f "$output_file"
            ;;
        *)
            echo "Unsupported agent: $agent" >&2
            return 1
            ;;
    esac
}

# Оповещение о завершении: кроссплатформенно (Windows/macOS/Linux)
notify_done() {
    local msg="${1:-Готово.}"
    if [[ "$OSTYPE" == darwin* ]] && command -v say &>/dev/null; then
        say -v Milena "$msg" 2>/dev/null || true
    elif [[ "$OSTYPE" == msys* ]] || [[ "$OSTYPE" == cygwin* ]] || [[ -n "$WINDIR" ]]; then
        powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('$msg');" 2>/dev/null || true
    fi
}

# --- Главный цикл ---
iteration=1

while has_pending_tasks; do
    echo "Итерация $iteration"
    echo "-----------------------------------"

    pending=$(count_pending)
    done_count=$(count_done)
    echo "Задач pending: $pending, done: $done_count"
    echo "-----------------------------------"

    agent=$(resolve_agent) || {
        echo "Не найден поддерживаемый агент. Установите Cursor CLI (agent), claude или codex, либо задайте RALPH_AGENT (cursor|claude|codex)." >&2
        exit 1
    }
    echo "Агент: $agent"

    prompt=$(cat <<EOF
@${TASKS_FILE} @${PROGRESS_FILE} @${PRD_FILE}

Контекст: проект Gen — браузерная пошаговая RPG (см. PRD). Стек: React + TypeScript, Vite, Zustand, Ant Design, React Router. Код только на React+TypeScript.

1. Найди задачу с наивысшим приоритетом и статусом pending, у которой все зависимости уже в статусе done. Работай ТОЛЬКО над этой задачей.
2. Перед завершением проверь: выполни \`npm run build\` (и при наличии \`npm run lint\`). Сборка должна проходить без ошибок.
3. Выполни ВСЕ test_steps из выбранной задачи. Только после успешного прохождения пометь задачу как done в tasks.json.
4. Обнови progress.md — добавь запись о выполненной работе для следующей итерации.
5. Сделай git commit для этой фичи.
6. Работай только над одной задачей за итерацию. Не удаляй и не редактируй другие задачи — только меняй status.
7. Когда задача полностью выполнена и помечена done, выведи в ответе ровно: <promise>COMPLETE</promise>

Используй agent_instructions из tasks.json (before_start, during_work, before_finish).
EOF
)

    result=$(run_agent "$agent" "$prompt")
    echo "$result"

    if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
        echo "✓ Задача выполнена!"
        remaining=$(count_pending)
        if [[ "$remaining" -eq 0 ]]; then
            echo "🎉 Все задачи выполнены!"
            notify_done "Хозяин, я всё сделал."
            exit 0
        fi
        echo "Осталось задач: $remaining. Продолжаю..."
        notify_done "Задача готова. Продолжаю работу."
    fi

    ((iteration++)) || true
done

echo "Все задачи выполнены! Итераций: $((iteration - 1))"
notify_done "Хозяин, я сделал."
