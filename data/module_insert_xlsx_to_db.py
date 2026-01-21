import pandas as pd
import pyodbc
import numpy as np

# --- CẤU HÌNH KẾT NỐI ---
# --- CẤU HÌNH KẾT NỐI ---
DB_CONFIG = {
    'server': 'LAPTOP-MAUAG945',   # <-- Đã điền tên máy của bạn
    'database': 'ShopeeFood',
    'driver': '{SQL Server}',      # <-- Đổi sang driver mặc định của Windows cho chắc chắn
    'trusted_connection': 'yes'
}

# --- CẤU HÌNH FILE EXCEL ---
EXCEL_FILE = 'ShopeeFood_Full_Data.xlsx'

# --- 1. ĐỊNH NGHĨA THỨ TỰ INSERT ĐỂ TRÁNH LỖI KHÓA NGOẠI (FK) ---
# Logic: Bảng không có FK hoặc FK trỏ đến bảng đã có thì xếp trước.
TABLE_ORDER = [
    "Role",                 # Độc lập
    "User",                 # Độc lập
    "User_Role_Mapping",    # Phụ thuộc User, Role
    "Merchant",             # Phụ thuộc User
    "Driver",               # Phụ thuộc User
    "Driver_Location",      # Phụ thuộc Driver
    "Menu_Category",        # Phụ thuộc Merchant
    "Option_Topping",       # Phụ thuộc Merchant
    "Food_Item",            # Phụ thuộc Category
    "Food_Topping_Mapping", # Phụ thuộc Food, Topping
    "Voucher",              # Độc lập (nhưng thường insert sau để tránh rối ID)
    "Cart",                 # Phụ thuộc User, Merchant
    "Cart_Item",            # Phụ thuộc Cart, Food
    "Cart_Item_Topping",    # Phụ thuộc Cart_Item, Topping
    "Order",                # Phụ thuộc User, Merchant, Driver, Voucher
    "Order_Detail",         # Phụ thuộc Order, Food
    "Order_Detail_Topping", # Phụ thuộc Order_Detail
    "Payment",              # Phụ thuộc Order
    "Review"                # Phụ thuộc Order
]

# --- 2. DANH SÁCH CÁC CỘT CẦN THÊM 'N' (NVARCHAR) ---
# Dựa trên Schema bạn cung cấp
UNICODE_COLS = {
    'Full_Name', 'Role_Name', 'Store_Name', 'Store_Address', 
    'Shop_Type', 'Vehicle_Type', 'Name_Category', 
    'Food_Name', 'Descriptions', 'Status_Food', 
    'Name_Option', 'Note', 'Voucher_Type', 
    'Delivery_Address', 'Topping_Name', 
    'Payment_Method', 'Status', 'Comment', 'Review_Type',
    'Address_Delivery'
}

def get_connection():
    conn_str = f"DRIVER={DB_CONFIG['driver']};SERVER={DB_CONFIG['server']};DATABASE={DB_CONFIG['database']};Trusted_Connection={DB_CONFIG['trusted_connection']}"
    return pyodbc.connect(conn_str)

def clean_value(val, col_name):
    # 1. Xử lý NULL/NaN (Ô trống)
    if val is None or pd.isna(val) or str(val).lower() == 'nan':
        return "NULL"
    
    # 2. [QUAN TRỌNG] Xử lý số thực (float) thành số nguyên (int)
    # Nếu giá trị là 57.0 -> Chuyển thành "57" để SQL không lỗi
    if isinstance(val, float) and val.is_integer():
        return str(int(val))
    
    # 3. Xử lý chuỗi văn bản
    str_val = str(val).strip()
    str_val = str_val.replace("'", "''") # Nhân đôi dấu nháy đơn để tránh lỗi SQL
    
    # 4. Thêm N'...' cho cột có dấu tiếng Việt (Unicode)
    if col_name in UNICODE_COLS:
        return f"N'{str_val}'"
    
    # Mặc định bao quanh các giá trị khác bằng dấu nháy đơn
    return f"'{str_val}'"
    """Xử lý giá trị để đưa vào câu lệnh SQL"""
    # 1. Xử lý NULL/None/NaN
    if val is None or pd.isna(val) or str(val).lower() == 'nan':
        return "NULL"
    
    # 2. Xử lý dữ liệu Text
    str_val = str(val).strip()
    
    # Escape dấu nháy đơn (') trong chuỗi -> ('')
    str_val = str_val.replace("'", "''")
    
    # Nếu là cột Unicode (Tiếng Việt) -> Thêm N phía trước
    if col_name in UNICODE_COLS:
        return f"N'{str_val}'"
    
    # Các cột Text thường (ID, Code, URL...) hoặc Ngày tháng dạng chuỗi
    # Kiểm tra nếu là số thì trả về số, ngược lại bao quanh bởi dấu nháy
    try:
        # Nếu convert được sang float mà không thay đổi giá trị (tránh trường hợp số điện thoại bị mất số 0)
        # Tuy nhiên ID và Phone là varchar nên vẫn cần dấu nháy
        # Cách an toàn nhất cho SQL Insert:
        # - Số (int/float) trong Excel -> Text trong SQL query thì không sao (SQL tự ép kiểu nếu cột là int)
        # - Nhưng Date/Varchar bắt buộc phải có nháy.
        
        # Logic đơn giản: Nếu cột nằm trong danh sách cần N' thì đã xử lý ở trên.
        # Còn lại cứ đóng dấu nháy đơn '...' trừ khi nó là số thực sự trong ngữ cảnh string
        return f"'{str_val}'"
    except:
        return f"'{str_val}'"

def import_excel_to_sql():
    print(f"🔄 Đang đọc file Excel: {EXCEL_FILE}...")
    try:
        # Đọc toàn bộ các sheet
        xls = pd.read_excel(EXCEL_FILE, sheet_name=None)
    except FileNotFoundError:
        print(f"❌ Lỗi: Không tìm thấy file {EXCEL_FILE}")
        return

    conn = get_connection()
    cursor = conn.cursor()

    print("🚀 Bắt đầu quá trình Import vào Database...")

    # Duyệt qua từng bảng theo đúng thứ tự (Table Order)
    for table_name in TABLE_ORDER:
        if table_name not in xls:
            print(f"⚠️ Cảnh báo: Không tìm thấy sheet '{table_name}' trong file Excel. Bỏ qua.")
            continue
            
        df = xls[table_name]
        
        if df.empty:
            print(f"⚠️ Bảng {table_name} không có dữ liệu.")
            continue

        print(f"   -> Đang Insert bảng: {table_name} ({len(df)} dòng)...")
        
        # Lấy danh sách cột
        columns = list(df.columns)
        col_str = ", ".join([f"[{c}]" for c in columns]) # Thêm [] để tránh lỗi từ khóa SQL
        
        # Xử lý Identity Insert cho bảng Voucher (nếu có cột Identity)
        identity_insert_on = False
        if table_name == "Voucher":
            try:
                cursor.execute(f"SET IDENTITY_INSERT {table_name} ON")
                identity_insert_on = True
            except:
                pass # Có thể bảng chưa tạo Identity hoặc lỗi khác, bỏ qua

        for index, row in df.iterrows():
            # Tạo list các giá trị đã được format (N'text', NULL, 'date'...)
            values = []
            for col in columns:
                raw_val = row[col]
                
                # Xử lý đặc biệt cho kiểu DateTime trong pandas
                if isinstance(raw_val, (pd.Timestamp, pd.DatetimeIndex)):
                    raw_val = raw_val.strftime('%Y-%m-%d %H:%M:%S')
                
                # Xử lý format SQL
                sql_val = clean_value(raw_val, col)
                
                # Nếu cột không phải unicode và giá trị là số (VD: Price, Rating), bỏ dấu nháy để đúng chuẩn (tùy chọn, SQL server khá thông minh nên '100' vào cột INT vẫn được)
                # Nhưng để an toàn với clean_value ở trên ta cứ để string format insert
                
                values.append(sql_val)
            
            val_str = ", ".join(values)
            query = f"INSERT INTO [{table_name}] ({col_str}) VALUES ({val_str})"
            
            try:
                cursor.execute(query)
            except pyodbc.Error as e:
                print(f"❌ Lỗi tại dòng {index+2} bảng {table_name}: {e}")
                print(f"   Query: {query}")
                # conn.rollback() # Có thể rollback nếu muốn dừng ngay
        
        # Tắt Identity Insert nếu đã bật
        if identity_insert_on:
            cursor.execute(f"SET IDENTITY_INSERT {table_name} OFF")

        conn.commit() # Commit sau khi xong mỗi bảng
        print(f"   ✅ Hoàn tất bảng {table_name}")

    conn.close()
    print("\n🎉 THÀNH CÔNG! Đã import toàn bộ dữ liệu.")

if __name__ == "__main__":
    import_excel_to_sql()