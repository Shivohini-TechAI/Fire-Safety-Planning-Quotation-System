# Fire Safety Rule Engine — Member 6

Converts the spaces detected by Member 5's computer-vision pipeline into a
recommended fire-safety equipment list, ready for Member 4's pricing engine.

## ✅ Status — UAE rules are now live

The client is confirmed to be based in the **UAE**, so `config/rules_uae.json`
is active (`.env` → `RULES_CONFIG_PATH=config/rules_uae.json`). It implements
19 rules drawn from the **UAE Civil Defence Fire & Life Safety Code of
Practice**, which is built on top of these NFPA standards:

| Concern              | Standard reference used                     |
|-----------------------|----------------------------------------------|
| Sprinklers            | NFPA 13-2019 (Ordinary Hazard Gr.1 for office/retail/restaurant, Light Hazard for schools/houses/flats/hotels) |
| Detection & alarm     | NFPA 72-2019 (smoke detectors, heat detectors, fire alarm panel) |
| Extinguishers         | NFPA 10-2018 (dry powder + CO2 for kitchens) |
| Means of egress       | NFPA 101-2018 (emergency lighting, exit signs) |
| Standpipe / hose reel | UAE Civil Defence Code Section 4.7 + NFPA 14-2019 (fire hose cabinets, high-rise wet riser) |

This lines up with the reference floor plan you shared earlier — its pipe
schedule was already written to NFPA-13, confirming this standard family.

**Engineering-defaults disclaimer:** these values encode publicly known,
commonly cited NFPA/UAE Civil Defence provisions to get the system running
end-to-end. They are not a substitute for sign-off by a licensed UAE fire
safety consultant or Dubai/Abu Dhabi Civil Defence approval before any real
client quotation goes out. Treat every number in `config/rules_uae.json` as
"verify before production," not "final legal truth" — see the `_readme` and
`references` fields at the top of that file for exactly which clause each
rule is based on, so your consultant can check them quickly.

If a future client is in a different country, don't edit `rules_uae.json` —
duplicate it (e.g. `rules_india.json`), point `RULES_CONFIG_PATH` at the new
file, and reload. `config/rules_template.json` is kept around as a blank
starting point for exactly that situation.

## Project structure

```
fire-safety-rule-engine/
├── config/
│   ├── settings.py          # env-driven configuration
│   ├── rules_uae.json       # ACTIVE — UAE Civil Defence / NFPA-based rules
│   └── rules_template.json  # blank starting point for a future non-UAE client
├── app/
│   ├── main.py                # FastAPI app entrypoint
│   ├── models/schemas.py      # Pydantic contracts (Member 5 in / Member 4 out)
│   ├── core/
│   │   ├── area_calculator.py    # building/floor area + space-type metrics
│   │   ├── rule_loader.py        # loads + validates the active rules file
│   │   ├── rule_engine.py        # generic rule mechanism (building-type aware)
│   │   ├── deduplicator.py       # merges duplicate equipment lines
│   │   ├── validator.py          # false-detection handling
│   │   └── response_builder.py   # builds the final API response
│   ├── api/routes.py           # /health /rules /rules/reload /recommend
│   └── utils/logger.py         # persists review flags to logs/
├── data/
│   ├── sample_input.json    # sample office floor plan (matches Member 5's schema)
│   ├── raw/                 # drop your dataset here
│   └── processed/
├── scripts/
│   ├── run_sample_pipeline.py  # run the full pipeline without the API
│   └── load_dataset.py         # generic CSV/Excel/JSON inspector
└── tests/                   # 32 tests — generic mechanism + UAE-specific rules
```

---

## Running it on your local computer

### 1. Prerequisites

- **Python 3.10 or newer** (this was built and tested on 3.12). Check with:
  ```bash
  python --version
  ```
  If you don't have Python, install it from python.org or via your OS
  package manager.

### 2. Unzip the project and open a terminal there

```bash
cd fire-safety-rule-engine
```

### 3. Create a virtual environment (keeps dependencies isolated)

```bash
python -m venv venv
```

Activate it:
```bash
# macOS / Linux
source venv/bin/activate

# Windows (Command Prompt)
venv\Scripts\activate.bat

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```
You'll know it worked because your terminal prompt gets a `(venv)` prefix.

### 4. Install dependencies

Everything needed is pinned in `requirements.txt`:

```bash
pip install -r requirements.txt
```

This installs:

| Package             | Why it's needed                                    |
|----------------------|------------------------------------------------------|
| fastapi              | the web framework that exposes /recommend etc.       |
| uvicorn[standard]    | the ASGI server that actually runs FastAPI            |
| pydantic             | validates every request/response shape                 |
| python-dotenv        | loads .env into the app's settings                     |
| pytest               | runs the test suite                                     |
| httpx                | needed by FastAPI's TestClient for the API tests        |
| pandas               | used by scripts/load_dataset.py for your dataset        |

### 5. Set up your environment file

```bash
# macOS / Linux
cp .env.example .env

# Windows
copy .env.example .env
```
The defaults already point at the UAE rules and port 8002 — you don't need
to change anything to get started.

### 6. Run the test suite (confirms everything works before you touch code)

```bash
pytest -v
```
You should see `32 passed`.

### 7. Try the pipeline without starting a server

```bash
python scripts/run_sample_pipeline.py
```
This runs a sample office floor plan through the whole system and prints
the building summary, any review flags, and the final equipment
recommendations — good for a quick sanity check.

### 8. Start the actual API server

```bash
uvicorn app.main:app --reload --port 8002
```
- `--reload` restarts the server automatically whenever you edit a file —
  useful while developing, remove it in production.
- Leave this running in its own terminal window/tab.

### 9. Open the interactive API docs

Visit http://localhost:8002/docs in your browser. FastAPI auto-generates a
Swagger UI where you can call /recommend, /rules, and /health directly from
the browser — no Postman needed.

### 10. Test it with your own data

Once your dataset is ready, either:
- **Inspect it first:**
  ```bash
  python scripts/load_dataset.py path/to/your/dataset.csv
  ```
  prints shape, columns, dtypes, and missing values.
- **Feed a floor plan through the API** — paste a JSON body shaped like
  data/sample_input.json into the /recommend box in the Swagger docs, or
  send it with curl:
  ```bash
  curl -X POST http://localhost:8002/recommend \
    -H "Content-Type: application/json" \
    -d @data/sample_input.json
  ```

### When you're done

```bash
deactivate
```
(exits the virtual environment; run `source venv/bin/activate` again next
time you come back to the project.)

---

## Endpoints

| Method | Path            | Purpose                                                |
|--------|-----------------|----------------------------------------------------------|
| GET    | /health         | Health check                                              |
| GET    | /rules          | Shows which standard is active, template or real, rule count |
| POST   | /rules/reload   | Reload the rules file from disk, no restart needed        |
| POST   | /recommend      | Main endpoint — floor plan JSON in, equipment list out     |

## Editing the UAE rules

Every rule in config/rules_uae.json is a small JSON object — no code changes
needed to tweak a threshold or add a new one:

```json
{
  "rule_id": "UAE-ROOM-SD-001",
  "description": "Smoke detector in every room >=215 sqft. Coverage 900 sqft per detector.",
  "applies_to_space_type": "room",
  "applies_to_building_types": null,
  "condition": { "field": "area_sqft", "operator": ">=", "value": 215 },
  "action": {
    "equipment": "smoke_detector",
    "qty_rule": { "type": "per_area_sqft", "divisor": 900 }
  },
  "standard_reference": "NFPA 72-2019 Section 17.6.3.1"
}
```

- `applies_to_building_types: null` means the rule applies to every building
  type. Set it to a list like `["office", "retail"]` to restrict it.
- `qty_rule.type` can be `fixed`, `per_area_sqft`, `per_length_ft`, or
  `equals_field` (copies a numeric field like num_floors as the quantity —
  used for "1 zone control valve per floor").

After editing, either restart uvicorn or call:
```bash
curl -X POST http://localhost:8002/rules/reload
```
to pick up the change without a restart.
