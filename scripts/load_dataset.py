"""
Generic dataset loader/inspector. Point it at whatever file the team
provides (CSV, Excel, or JSON) and it prints a quick summary — shape,
columns, dtypes, missing values, first rows — before any real analysis
starts.

Usage:
    python scripts/load_dataset.py path/to/your/dataset.csv
"""
import sys
from pathlib import Path

import pandas as pd


def load(path: Path) -> pd.DataFrame:
    suffix = path.suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(path)
    if suffix in (".xlsx", ".xls"):
        return pd.read_excel(path)
    if suffix == ".json":
        return pd.read_json(path)
    raise ValueError(f"Unsupported file type: {suffix}")


def summarise(df: pd.DataFrame) -> None:
    print(f"Shape: {df.shape[0]} rows x {df.shape[1]} columns\n")

    print("Columns and types:")
    print(df.dtypes, "\n")

    print("Missing values per column:")
    print(df.isnull().sum(), "\n")

    print("First 5 rows:")
    print(df.head())


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/load_dataset.py <path-to-dataset>")
        sys.exit(1)

    dataframe = load(Path(sys.argv[1]))
    summarise(dataframe)
