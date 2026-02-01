import pandas as pd
import pyodbc
import io
import datetime
import numpy as np

# ================= 1. CẤU HÌNH KẾT NỐI =================
DB_CONFIG = {
    'server': 'LAPTOP-MAUAG945',      
    'database': 'ShopeeFood',         
    'username': 'sa',                 
    'password': 'NguyenHai0151',      
}

CSV_FILE_PATH = 'ShopeeFood_Data.csv'

# ================= 2. THIẾT LẬP DỮ LIỆU & MAPPING =================

TABLE_ORDER = [
    'Users', 'Roles', 'Vouchers', 'UserRoles', 'Merchants', 'Drivers', 
    'DriverLocations', 'MenuCategories', 'ToppingOptions', 'FoodItems', 
    'FoodToppings', 'Carts', 'CartItems', 'CartItemToppings', 'Orders', 
    'OrderItems', 'OrderItemToppings', 'Payments', 'Reviews'
]

CSV_TO_SQL_MAP = {
    'users': 'Users',
    'roles': 'Roles',
    'vouchers': 'Vouchers',
    'userroles': 'UserRoles',
    'merchants': 'Merchants',
    'drivers': 'Drivers',
    'driverlocations': 'DriverLocations',
    'menucategories': 'MenuCategories',   
    'toppingoptions': 'ToppingOptions',
    'fooditems': 'FoodItems',
    'foodtoppings': 'FoodToppings',
    'carts': 'Carts',
    'cartitems': 'CartItems',
    'cartitemtopping': 'CartItemToppings',
    'cartitemtoppings': 'CartItemToppings',
    'orders': 'Orders',
    'orderitems': 'OrderItems',
    'orderitemtoppings': 'OrderItemToppings',
    'payments': 'Payments',
    'reviews': 'Reviews'
}

COLUMN_MAPPING = {
    'UserID': 'UserId', 'Description': 'Descriptions',
    'MatKhau': 'Passwords', 'Password': 'Passwords',
    'NameCategory': 'CategoryName',
    'CreateAt': 'CreatedAt',       
    'MediaURL': 'MediaUrl',
    'Note': 'Note'
}

# [FIX] CẬP NHẬT PREFIX CHO OrderItems TỪ 'OD' -> 'DT'
ID_PREFIXES = {
    'Users': 'US', 'Drivers': 'DR', 'DriverLocations': 'DR',
    'Merchants': 'ME', 'Orders': 'OD', 
    'OrderItems': 'DT',  # <--- SỬA LỖI TẠI ĐÂY (Dữ liệu là DT10000...)
    'Reviews': 'RE', 'FoodItems': 'FO', 'MenuCategories': 'CA',
    'Carts': 'CT', 'CartItems': 'CI' 
}

DATE_COLUMNS = [
    'BirthDate', 'AssignedDate', 'OpenTime', 'CloseTime', 'UpdatedAt', 
    'CreatedAt', 'StartDate', 'EndDate', 'OrderTime', 'PickupTime', 
    'DeliveryTime', 'PaymentDate', 'CreateAt'
]

DECIMAL_COLUMNS = [
    'Latitude', 'Longitude', 'OriginalPrice', 'SalePrice', 'Surcharge',                        
    'SubtotalPrice', 'DiscountValue', 'MinOrderValue', 'FoodAmount', 
    'ShippingFee', 'DiscountAmount', 'UnitPrice', 'ToppingPrice', 'Amount'                            
]

BIT_COLUMNS = ['IsActive', 'IsVerified', 'ActiveStatus']
COMPUTED_COLUMNS = ['FinalAmount']

# ================= 3. HÀM XỬ LÝ =================

def get_connection():
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={DB_CONFIG['server']};"
        f"DATABASE={DB_CONFIG['database']};"
        f"UID={DB_CONFIG['username']};"
        f"PWD={DB_CONFIG['password']}"
    )
    return pyodbc.connect(conn_str)

def parse_mixed_csv(file_path):
    tables = {}
    current_sql_table = None 
    buffer = []
    
    print(f"--> Đang đọc file {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            lines = f.readlines()

        for line in lines:
            line_content = line.strip()
            if not line_content or line_content.replace(';', '') == '':
                continue
            
            parts = line_content.split(';')
            raw_name = parts[0].strip().replace("Bảng ", "").strip().lower()
            
            if raw_name in CSV_TO_SQL_MAP:
                target_table = CSV_TO_SQL_MAP[raw_name]
                if current_sql_table and buffer:
                    try:
                        csv_str = '\n'.join(buffer)
                        df = pd.read_csv(io.StringIO(csv_str), sep=';', dtype=str)
                        tables[current_sql_table] = df
                    except Exception: pass
                current_sql_table = target_table
                buffer = []
            else:
                if current_sql_table:
                    buffer.append(line_content)

        if current_sql_table and buffer:
            csv_str = '\n'.join(buffer)
            df = pd.read_csv(io.StringIO(csv_str), sep=';', dtype=str)
            tables[current_sql_table] = df
            
        return tables
    except FileNotFoundError:
        print(f"[LỖI] Không tìm thấy file csv.")
        return {}

def clean_and_import(table_name, df_input, cursor):
    df = df_input.copy()
    original_count = len(df)
    
    # 1. Lọc rác
    pk_col = df.columns[0]
    if table_name in ID_PREFIXES:
        prefix = ID_PREFIXES[table_name]
        df = df[df[pk_col].str.startswith(prefix, na=False)]
    else:
        df = df[df[pk_col].notnull() & (df[pk_col] != '')]

    final_count = len(df)
    print(f"--> Bảng {table_name}: {original_count} -> {final_count} dòng.")
    if df.empty: return

    # 2. Chuẩn hóa & Mapping Tên Cột
    df.columns = [c.strip() for c in df.columns]
    df.rename(columns=COLUMN_MAPPING, inplace=True)
    
    cols_to_drop = [c for c in df.columns if 'Unnamed' in c or c in COMPUTED_COLUMNS]
    if cols_to_drop: df.drop(columns=cols_to_drop, inplace=True)
    df.dropna(axis=1, how='all', inplace=True)

    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)

    # 3. Phone
    if 'PhoneNumber' in df.columns:
        df['PhoneNumber'] = df['PhoneNumber'].apply(
            lambda x: '0' + str(x) if pd.notnull(x) and str(x).isdigit() and not str(x).startswith('0') else x
        )

    # 4. Date
    for col in DATE_COLUMNS:
        target_col = col
        if col == 'CreateAt' and 'CreatedAt' in df.columns: target_col = 'CreatedAt'
        
        if target_col in df.columns:
            df[target_col] = pd.to_datetime(df[target_col], dayfirst=True, errors='coerce')
            if target_col in ['OpenTime', 'CloseTime']:
                 df[target_col] = df[target_col].dt.strftime('%H:%M:%S')
            else:
                 df[target_col] = df[target_col].dt.strftime('%Y-%m-%d %H:%M:%S')

    # 5. Decimal
    for col in DECIMAL_COLUMNS:
        if col in df.columns:
            df[col] = df[col].astype(str).str.replace(',', '.', regex=False)
            df[col] = pd.to_numeric(df[col], errors='coerce')
            if col in ['Latitude', 'Longitude']:
                df[col] = df[col].round(6)

    # 6. BIT
    df_cols_lower = [c.lower() for c in df.columns]
    for bit_col in BIT_COLUMNS:
        if bit_col.lower() in df_cols_lower:
            actual = df.columns[df_cols_lower.index(bit_col.lower())]
            df[actual] = df[actual].astype(str).apply(
                lambda x: 1 if x.strip() in ['1', 'True', 'true'] else 0
            )

    # 7. NULL
    df = df.replace(r'^\s*$', np.nan, regex=True)
    df = df.replace(['nan', 'NULL', 'None'], np.nan)
    df = df.where(pd.notnull(df), None)

    # 8. Insert
    columns_sql = ",".join([f"[{c}]" for c in df.columns])
    placeholders = ",".join(["?"] * len(df.columns))
    sql = f"INSERT INTO {table_name} ({columns_sql}) VALUES ({placeholders})"
    
    data_to_insert = [tuple(x) for x in df.to_numpy()]
    
    try:
        if table_name == 'Vouchers': cursor.execute(f"SET IDENTITY_INSERT {table_name} ON")
        cursor.executemany(sql, data_to_insert)
        if table_name == 'Vouchers': cursor.execute(f"SET IDENTITY_INSERT {table_name} OFF")
        print(f"    [OK] Xong {table_name}.")
    except Exception as e:
        print(f"    [LỖI] Tại bảng {table_name}: {e}")
        # print(f"    -> Các cột Insert: {list(df.columns)}")
        raise e

# ================= 4. MAIN =================
def main():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        print("=== BẮT ĐẦU IMPORT ===")
        
        tables_data = parse_mixed_csv(CSV_FILE_PATH)
        
        for table_name in TABLE_ORDER:
            if table_name in tables_data:
                clean_and_import(table_name, tables_data[table_name], cursor)
            else:
                pass
        
        conn.commit()
        print("\n=== HOÀN TẤT THÀNH CÔNG 100% ===")
        
    except Exception as e:
        if conn: conn.rollback()
        print(f"\n[ROLLBACK] Đã hoàn tác. Lỗi: {e}")
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    main()