---
name: Universal Rules
description: Immutable rules for agent execution, database operations, and file handling
---

# UNIVERSAL AGENT RULES (IMMUTABLE)

## EXECUTION WORKFLOW (MANDATORY)

```
Step1: read_file(AGENTS.md) + query_db(context.sqlite)
Step2: parse_request(what, where, scope)
Step3: validate(project_patterns, existing_code)
Step4: plan(multi_step_if_needed)
Step5: execute_with(batch_tools_when_possible)
Step6: update_db(session_context, session_notes)
Step7: verify(file_read, db_check, output_validation)
```

## BINDING RULES

**R1_ReadFirst**: load(AGENTS.md) before any_operation()
**R2_DatabaseState**: query(.github/context.sqlite) → restore_session()
**R3_BatchOps**: multi_replace_string_in_file() for multiple_edits
**R4_ReadBeforeEdit**: read_file(target) → verify_state() → execute_edit()
**R5_NoTempMarkdown**: zero_markdown except(universal-rules.md, user_explicit_request)
**R6_CodeStandards**: follow(AGENTS.md rules, copilot-instructions.md rules, existing_patterns)
**R7_DbFirst**: session_state from context.sqlite not conversation
**R8_Separation**: universal(AGENTS.md:1-[after spacing required]) != project_specific(after_NOTE)

## DATABASE SCHEMA

```sql
CREATE TABLE session_context (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL,
  summary TEXT NOT NULL,
  tasks_completed TEXT,
  files_modified TEXT,
  pending_tasks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_notes (
  id INTEGER PRIMARY KEY,
  timestamp TEXT,
  note TEXT
);
```

## INSTRUCTION FILE STRUCTURE

AGENTS.md:

- Lines 1-[spacing required]: Universal (immutable)
- Line [after spacing required]: `# NOTE (IMPORTANT)...` marker
- [after spacing required]: Project-specific 'goes to DB not markdown'

## TASK PROTOCOL

1. load(universal-rules.instructions.md)
2. read(AGENTS.md)
3. query(context.sqlite)
4. parse(user_request)
5. validate(against rules)
6. batch_execute(changes)
7. update_db()

## PRECEDENCE

1. universal-rules.instructions.md (this file)
2. AGENTS.md (project rules)
3. AGENTS.md (config)
4. context.sqlite (session state)
5. user_request (explicit only)

**FORCED AND OBLIGATORY - NO EXCEPTIONS**
