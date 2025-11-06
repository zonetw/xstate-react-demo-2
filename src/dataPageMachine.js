import { createMachine, assign } from "xstate"; // 導入 createMachine 和 assign 函數

export const dataPageMachine = createMachine(
  {
    id: "dataPage",
    // 機器的上下文 (Context)，用於儲存資料和設定，類似於 useState 中的狀態值
    context: {
      data: [], // 表格中顯示的資料
      currentSearchKeyword: "", // 當前搜尋關鍵字
      currentSearchId: "", // 當前搜尋ID
      editingRowId: null, // 正在編輯的資料行ID
      editingFormData: {}, // 正在編輯的表單資料副本
      userRole: "readonly", // 使用者角色: 'readonly', 'editSomeColumn', 'editWholeData'
      error: null, // 錯誤訊息
      message: null, // 成功訊息
    },
    initial: "idle", // 初始狀態
    states: {
      idle: {
        on: {
          FETCH: {
            // 接收到 FETCH 事件，準備開始載入資料
            target: "loading", // 轉換到 'loading' 狀態
            actions: assign({
              // 更新上下文中的搜尋參數
              currentSearchKeyword: (_, event) => event.keyword,
              currentSearchId: (_, event) => event.id,
              data: [], // 清空之前的資料
              error: null, // 清空錯誤
              message: null, // 清空訊息
            }),
          },
          LOGIN: {
            // 模擬登入以切換角色
            actions: assign({
              userRole: (_, event) => event.role, // 更新使用者角色
            }),
          },
        },
      },
      loading: {
        // 當進入 'loading' 狀態時，執行資料獲取副作用
        invoke: {
          id: "fetchData", // 服務ID
          src: "fetchDataService", // 服務來源 (定義在 machine 配置的 services 物件中)
          onDone: {
            // 資料獲取成功
            target: "displayingData", // 轉換到 'displayingData' 狀態
            actions: assign({
              // 將獲取到的資料存入 context
              data: (_, event) => event.data,
              error: null, // 清除錯誤
            }),
          },
          onError: {
            // 資料獲取失敗
            target: "idle", // 轉換回 'idle' 狀態（或可以轉換到一個錯誤狀態）
            actions: assign({
              // 將錯誤信息存入 context
              error: (_, event) => event.data.message || "資料獲取失敗",
              data: [], // 清空資料
            }),
          },
        },
      },
      displayingData: {
        on: {
          FETCH: {
            // 在顯示資料狀態下，再次搜尋
            target: "loading",
            actions: assign({
              currentSearchKeyword: (_, event) => event.keyword,
              currentSearchId: (_, event) => event.id,
              error: null,
              message: null,
            }),
          },
          EDIT_ROW: {
            // 接收 EDIT_ROW 事件，準備編輯資料行
            target: "editingRow", // 轉換到 'editingRow' 狀態
            // 使用 'cond' 守衛檢查使用者是否有編輯權限
            guard: "canEditRow",
            actions: assign((context, event) => ({
              // 將要編輯的資料行複製到 editingFormData
              editingRowId: event.id,
              editingFormData:
                context.data.find((row) => row.id === event.id) || {},
              error: null,
              message: null,
            })),
          },
          LOGIN: {
            // 模擬登入以切換角色
            actions: assign({
              userRole: (_, event) => event.role,
            }),
          },
        },
      },
      editingRow: {
        on: {
          UPDATE_FIELD: {
            // 接收 UPDATE_FIELD 事件，更新編輯中的表單資料
            actions: assign({
              editingFormData: (context, event) => ({
                ...context.editingFormData,
                [event.field]: event.value, // 更新特定欄位的值
              }),
            }),
          },
          SAVE: {
            // 接收 SAVE 事件，準備儲存資料
            target: "savingData", // 轉換到 'savingData' 狀態
            guard: "canSaveData", // 使用 'cond' 守衛檢查使用者是否有儲存權限
            actions: assign({
              error: null,
              message: null,
            }),
          },
          CANCEL: "displayingData", // 接收 CANCEL 事件，取消編輯，返回顯示資料狀態
        },
      },
      savingData: {
        invoke: {
          id: "saveData", // 服務ID
          src: "saveDataService", // 服務來源
          onDone: {
            // 資料儲存成功
            target: "displayingData", // 轉換回 'displayingData' 狀態
            actions: assign({
              // 優化更新：直接在本地更新已編輯的資料行，而非重新獲取
              data: (context, event) =>
                context.data.map((row) =>
                  row.id === context.editingRowId
                    ? { ...row, ...event.data }
                    : row
                ),
              editingRowId: null, // 清除編輯中的ID
              editingFormData: {}, // 清空編輯中的表單資料
              error: null,
              message: "資料儲存成功！", // 設定成功訊息
            }),
          },
          onError: {
            // 資料儲存失敗
            target: "editingRow", // 保留在編輯狀態，顯示錯誤訊息
            actions: assign({
              error: (_, event) => event.data.message || "資料儲存失敗",
              message: null,
            }),
          },
        },
      },
    },
  },
  {
    // 實現 XState 機器中定義的服務 (Side Effects)
    services: {
      fetchDataService: async (context) => {
        console.log(
          `XState Effect: Fetching data for keyword: ${context.currentSearchKeyword}, id: ${context.currentSearchId}`
        );
        // 模擬 API 呼叫，根據 keyword 和 id 篩選
        const url = `https://jsonplaceholder.typicode.com/posts?q=${context.currentSearchKeyword}&id=${context.currentSearchId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`網路回應不正常: ${response.statusText}`);
        }
        const rawData = await response.json();
        // 模擬更真實的資料結構，包含 columnA, columnB
        return rawData.slice(0, 5).map((item) => ({
          id: item.id,
          title: item.title.substring(0, 20) + "...",
          body: item.body.substring(0, 50) + "...",
          columnA: `值A-${item.id}`,
          columnB: `值B-${item.id}`,
        }));
      },
      saveDataService: async (context) => {
        console.log("XState Effect: Saving data:", context.editingFormData);
        // 模擬 API 呼叫，根據使用者角色模擬儲存邏輯
        const { editingFormData, editingRowId, userRole } = context;

        // 根據角色模擬欄位限制
        if (userRole === "editSomeColumn") {
          // 如果是 editSomeColumn 角色，只允許修改 columnA，其他欄位會被忽略或拒絕
          const allowedData = {
            id: editingFormData.id, // ID 必須保留
            columnA: editingFormData.columnA,
            // 其他欄位將不會被儲存
          };
          console.warn(
            "User role 'editSomeColumn' - only columnA will be considered for save."
          );
          // For demo, we will pretend other fields are not sent or ignored by backend
          // Or we could throw an error if other fields are modified
          // If editingFormData has keys other than 'id' and 'columnA' throw error for demo
          const otherKeys = Object.keys(editingFormData).filter(
            (key) => key !== "id" && key !== "columnA"
          );
          if (otherKeys.length > 0) {
            throw new Error("此角色只能修改 `Column A`。");
          }
        }

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${editingRowId}`,
          {
            method: "PUT", // 或 PATCH
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingFormData), // 發送編輯後的資料
          }
        );
        if (!response.ok) {
          throw new Error(`網路回應不正常: ${response.statusText}`);
        }
        const savedData = await response.json();
        return { ...editingFormData, ...savedData }; // 返回合併後的資料，通常是後端返回的最新狀態
      },
    },
    // 定義守衛 (Guards) 函數，用於在轉換前檢查條件
    guards: {
      canEditRow: (context) => {
        // 只有 'editSomeColumn' 或 'editWholeData' 角色才能編輯資料行
        return (
          context.userRole === "editSomeColumn" ||
          context.userRole === "editWholeData"
        );
      },
      canSaveData: (context) => {
        // 只有 'editSomeColumn' 或 'editWholeData' 角色才能儲存資料
        return (
          context.userRole === "editSomeColumn" ||
          context.userRole === "editWholeData"
        );
      },
      canEditColumnA: (context) => {
        // 只有 'editSomeColumn' 或 'editWholeData' 角色才能編輯 Column A
        return (
          context.userRole === "editSomeColumn" ||
          context.userRole === "editWholeData"
        );
      },
      canEditOtherColumns: (context) => {
        // 只有 'editWholeData' 角色才能編輯其他所有欄位
        return context.userRole === "editWholeData";
      },
    },
  }
);
