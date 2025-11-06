import React, { useState } from "react";
import { useMachine } from "@xstate/react";
import { dataPageMachine } from "./dataPageMachine.js";

function DataPageWithXState() {
  // 使用 useMachine 鉤子來啟動和與機器互動
  const [current, send] = useMachine(dataPageMachine);

  // 從機器的上下文中解構資料
  const { data, editingFormData, userRole, error, message } = current.context;

  // 透過 state.matches() 檢查機器當前所處的狀態，取代傳統的布林值判斷
  const isLoading = current.matches("loading");
  const isEditing = current.matches("editingRow");
  const isSaving = current.matches("savingData");
  const isDisplaying = current.matches("displayingData");

  // 搜尋表單狀態
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchId, setSearchId] = useState("");

  const handleFetch = () => {
    send({ type: "FETCH", keyword: searchKeyword, id: searchId });
  };

  const handleEditRow = (id) => {
    send({ type: "EDIT_ROW", id });
  };

  const handleUpdateField = (field, value) => {
    send({ type: "UPDATE_FIELD", field, value });
  };

  const handleSave = () => {
    send("SAVE");
  };

  const handleCancel = () => {
    send("CANCEL");
  };

  // 根據角色判斷欄位是否可編輯
  const isColumnAEditable =
    current.can({ type: "UPDATE_FIELD", field: "columnA" }) &&
    current.context.userRole !== "readonly";
  const isOtherColumnsEditable =
    current.can({ type: "UPDATE_FIELD", field: "title" }) &&
    current.context.userRole === "editWholeData";

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>XState 驅動的資料管理頁面</h1>
      <p>
        當前角色: <strong>{userRole}</strong>
      </p>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          切換角色:
          <select
            value={userRole}
            onChange={(e) => send({ type: "LOGIN", role: e.target.value })}
            style={{ marginLeft: "5px" }}
          >
            <option value="readonly">唯讀 (Readonly)</option>
            <option value="editSomeColumn">編輯部分欄位 (Edit Column A)</option>
            <option value="editWholeData">
              編輯所有資料 (Edit Whole Data)
            </option>
          </select>
        </label>
      </div>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>錯誤: {error}</p>
      )}
      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
      )}

      {/* 搜尋表單 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #eee",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>資料搜尋</h3>
        <input
          type="text"
          placeholder="搜尋關鍵字 (Title)"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          disabled={isLoading || isEditing || isSaving}
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="搜尋 ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          disabled={isLoading || isEditing || isSaving}
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleFetch}
          disabled={isLoading || isEditing || isSaving}
          style={{
            padding: "8px 15px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isLoading ? "載入中..." : "搜尋資料"}
        </button>
      </div>

      {isLoading && <p>資料載入中...</p>}
      {isSaving && <p>資料儲存中...</p>}

      {/* 資料表格 */}
      {isDisplaying && data.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>資料列表</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  標題 (Title)
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  內文 (Body)
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Column A
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Column B
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {row.id}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {row.title}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {row.body}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {row.columnA}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {row.columnB}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => handleEditRow(row.id)}
                      // 檢查機器是否允許 EDIT_ROW 事件，以及當前角色是否有權限編輯
                      disabled={
                        !current.can({ type: "EDIT_ROW" }) ||
                        userRole === "readonly"
                      }
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#17a2b8",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      編輯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 編輯表單 */}
      {isEditing && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #007bff",
            borderRadius: "8px",
          }}
        >
          <h3>編輯資料 ({editingFormData.id})</h3>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>ID:</label>
            <input
              type="text"
              value={editingFormData.id || ""}
              disabled // ID 通常不可編輯
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "calc(100% - 18px)",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              標題 (Title):
            </label>
            <input
              type="text"
              value={editingFormData.title || ""}
              onChange={(e) => handleUpdateField("title", e.target.value)}
              // 根據角色判斷是否可編輯
              disabled={!isOtherColumnsEditable}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: `1px solid ${
                  isOtherColumnsEditable ? "#ccc" : "#f0f0f0"
                }`,
                width: "calc(100% - 18px)",
                backgroundColor: isOtherColumnsEditable ? "white" : "#f5f5f5",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              內文 (Body):
            </label>
            <textarea
              value={editingFormData.body || ""}
              onChange={(e) => handleUpdateField("body", e.target.value)}
              // 根據角色判斷是否可編輯
              disabled={!isOtherColumnsEditable}
              rows="4"
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: `1px solid ${
                  isOtherColumnsEditable ? "#ccc" : "#f0f0f0"
                }`,
                width: "calc(100% - 18px)",
                backgroundColor: isOtherColumnsEditable ? "white" : "#f5f5f5",
              }}
            ></textarea>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Column A:
            </label>
            <input
              type="text"
              value={editingFormData.columnA || ""}
              onChange={(e) => handleUpdateField("columnA", e.target.value)}
              // 根據角色判斷是否可編輯
              disabled={!isColumnAEditable}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: `1px solid ${isColumnAEditable ? "#ccc" : "#f0f0f0"}`,
                width: "calc(100% - 18px)",
                backgroundColor: isColumnAEditable ? "white" : "#f5f5f5",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Column B:
            </label>
            <input
              type="text"
              value={editingFormData.columnB || ""}
              onChange={(e) => handleUpdateField("columnB", e.target.value)}
              // 根據角色判斷是否可編輯
              disabled={!isOtherColumnsEditable}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: `1px solid ${
                  isOtherColumnsEditable ? "#ccc" : "#f0f0f0"
                }`,
                width: "calc(100% - 18px)",
                backgroundColor: isOtherColumnsEditable ? "white" : "#f5f5f5",
              }}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !current.can({ type: "SAVE" })} // 檢查機器是否允許 SAVE 事件
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#28a745",
              color: "white",
              cursor: "pointer",
            }}
          >
            {isSaving ? "儲存中..." : "儲存"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #dc3545",
              backgroundColor: "transparent",
              color: "#dc3545",
              cursor: "pointer",
            }}
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}

export default DataPageWithXState;
