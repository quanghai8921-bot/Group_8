package com.mycompany.datashopeefood;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;
import java.text.SimpleDateFormat;
import java.util.Date;

public class InsertShopeeFood {

    // 1. Cấu hình Database
    private static final String DB_URL = "jdbc:sqlserver://LAPTOP-MAUAG945;databaseName=ShopeeFood;encrypt=true;trustServerCertificate=true;";
    private static final String USER = "sa";
    private static final String PASS = "NguyenHai0151";

    // 2. Đường dẫn tới thư mục chứa file CSV
    private static final String CSV_FOLDER = "C:\\Users\\ACER\\Documents\\NetBeansProjects\\dataShopeeFood\\output_csv\\";

    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            System.out.println("Kết nối SQL Server thành công!");

            // THỨ TỰ INSERT BẮT BUỘC ĐỂ KHÔNG LỖI KHÓA NGOẠI (ĐÃ BỔ SUNG 4 BẢNG THIẾU)
            String[] tablesToImport = {
                "Users", "Roles", "Categories", "Vouchers",
                "UserRoles", "Drivers", "Merchants",
                "MerchantCategories", "ToppingOptions", "FoodItems",
                "FoodToppings",
                "Carts", "CartItems", "CartItemToppings", // <-- 3 bảng Giỏ hàng
                "Orders", "OrderItems", "OrderItemToppings", // <-- Thêm Topping cho đơn hàng
                "Payments", "Reviews"
            };

            for (String tableName : tablesToImport) {
                String filePath = CSV_FOLDER + tableName + ".csv";
                importCsvToTable(conn, filePath, tableName);
            }

            System.out.println("Hoàn tất toàn bộ quá trình Import!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void importCsvToTable(Connection conn, String filePath, String tableName) {
        System.out.println("Đang xử lý bảng: " + tableName + "...");

        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), StandardCharsets.UTF_8))) {
            String headerLine = br.readLine();
            if (headerLine == null) {
                System.out.println("File " + tableName + " trống.");
                return;
            }

            // Xóa ký tự BOM ẩn
            headerLine = headerLine.replace("\uFEFF", "").replace("ï»¿", "");

            // Nhận diện dấu phân cách
            char separator = headerLine.contains(";") ? ';' : ',';

            List<String> rawHeaders = parseCsvLine(headerLine, separator);
            List<String> validHeaders = new ArrayList<>();
            List<Integer> validIndices = new ArrayList<>();

            for (int i = 0; i < rawHeaders.size(); i++) {
                String header = rawHeaders.get(i).trim();
                // BỎ QUA CỘT COMPUTED TRONG BẢNG ORDERS
                if (tableName.equalsIgnoreCase("Orders") && header.equalsIgnoreCase("FinalAmount")) {
                    continue;
                }
                validHeaders.add(header);
                validIndices.add(i);
            }

            // Tạo câu lệnh INSERT động
            StringBuilder queryBuilder = new StringBuilder("INSERT INTO ").append(tableName).append(" (");
            StringBuilder placeholders = new StringBuilder(" VALUES (");

            for (int i = 0; i < validHeaders.size(); i++) {
                queryBuilder.append(validHeaders.get(i));
                placeholders.append("?");
                if (i < validHeaders.size() - 1) {
                    queryBuilder.append(", ");
                    placeholders.append(", ");
                }
            }
            queryBuilder.append(")").append(placeholders).append(")");
            String sqlInsert = queryBuilder.toString();

            try (PreparedStatement pstmt = conn.prepareStatement(sqlInsert)) {
                String line;
                int count = 0;

                while ((line = br.readLine()) != null) {
                    if (line.trim().isEmpty()) {
                        continue;
                    }

                    List<String> data = parseCsvLine(line, separator);

                    for (int j = 0; j < validIndices.size(); j++) {
                        int actualIndex = validIndices.get(j);
                        String columnName = validHeaders.get(j);
                        String value = "";

                        if (actualIndex < data.size()) {
                            value = data.get(actualIndex).trim();
                        }

                        // CHUẨN HÓA DỮ LIỆU CƠ BẢN
                        if (!value.isEmpty() && !value.equalsIgnoreCase("NULL")) {
                            // Thêm số 0 ở cột PhoneNumber
                            if (columnName.equalsIgnoreCase("PhoneNumber") && !value.startsWith("0")) {
                                value = "0" + value;
                            }
                            // Chuẩn hóa cắt đuôi ngày tháng
                            if (columnName.toLowerCase().contains("date")
                                    || columnName.toLowerCase().contains("time")
                                    || columnName.toLowerCase().contains("at")) {
                                value = formatDateTime(value);
                            }
                        }

                        // Truyền dữ liệu vào DB
                        if (value.isEmpty() || value.equalsIgnoreCase("NULL")) {
                            pstmt.setNull(j + 1, java.sql.Types.VARCHAR);
                        } else {
                            pstmt.setString(j + 1, value);
                        }
                    }
                    pstmt.addBatch();
                    count++;

                    // Batch execution để tối ưu tốc độ
                    if (count % 500 == 0) {
                        pstmt.executeBatch();
                    }
                }
                pstmt.executeBatch(); // Chạy những dòng còn sót lại
                System.out.println("-> Import thành công " + count + " dòng vào bảng " + tableName);
            }

        } catch (java.io.FileNotFoundException e) {
            System.err.println("-> Bỏ qua bảng " + tableName + ": Không tìm thấy file");
        } catch (Exception e) {
            System.err.println("-> Lỗi khi import bảng " + tableName + ": " + e.getMessage());
        }
    }

    // ========================================================================
    // HÀM TÁCH CSV THỦ CÔNG: TỐI ƯU VÀ NGẮN GỌN
    // ========================================================================
    private static List<String> parseCsvLine(String line, char separator) {
        List<String> result = new ArrayList<>();
        StringBuilder currentVal = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '\"') {
                inQuotes = !inQuotes; // Đảo trạng thái nếu gặp ngoặc kép
            } else if (c == separator && !inQuotes) {
                result.add(currentVal.toString().replace("\"", "").trim());
                currentVal.setLength(0);
            } else {
                currentVal.append(c);
            }
        }
        result.add(currentVal.toString().replace("\"", "").trim());
        return result;
    }

    // ========================================================================
    // HÀM CHUẨN HÓA THỜI GIAN ĐÃ ĐƯỢC ĐƠN GIẢN HÓA TỐI ĐA
    // ========================================================================
// ========================================================================
    // HÀM CHUẨN HÓA THỜI GIAN (XỬ LÝ TRIỆT ĐỂ LỖI DO EXCEL ĐỔI FORMAT)
    // ========================================================================
    private static String formatDateTime(String val) {
        if (val == null || val.trim().isEmpty() || val.equalsIgnoreCase("NULL")) {
            return val;
        }
        val = val.trim();

        // Cắt bỏ phần milli/micro-seconds (Ví dụ: .0000000)
        if (val.contains(".")) {
            val = val.substring(0, val.indexOf("."));
        }

        // Nếu chuỗi đã đúng chuẩn SQL (bắt đầu bằng yyyy-MM-dd) thì không cần ép kiểu
        if (val.matches("^\\d{4}-\\d{2}-\\d{2}.*")) {
            return val;
        }

        // Danh sách các định dạng ngày bị Excel tự động biến đổi
        String[] possibleFormats = {
            "dd/MM/yyyy HH:mm:ss", "MM/dd/yyyy HH:mm:ss",
            "dd/MM/yyyy", "MM/dd/yyyy",
            "dd-MM-yyyy HH:mm:ss", "MM-dd-yyyy HH:mm:ss",
            "dd-MM-yyyy", "MM-dd-yyyy"
        };

        for (String format : possibleFormats) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat(format);
                sdf.setLenient(false);
                Date date = sdf.parse(val);

                // Trả về đúng chuẩn SQL Server yêu cầu
                if (val.contains(":")) {
                    return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
                } else {
                    return new SimpleDateFormat("yyyy-MM-dd").format(date);
                }
            } catch (Exception ignored) {
                // Tiếp tục thử format khác nếu bị lỗi parse
            }
        }
        return val;
    }
}
