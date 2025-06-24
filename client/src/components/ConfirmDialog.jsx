import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel, actionType }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-purple-500/90 to-violet-700/90 p-6 rounded-2xl shadow-2xl text-center w-80 text-white border border-white/10 backdrop-blur-md">
        <p className="text-lg font-semibold mb-6">{message}</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="w-full py-2 rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white hover:brightness-110 transition-all duration-200"
          >
            {actionType === "logout" ? "Logout" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
