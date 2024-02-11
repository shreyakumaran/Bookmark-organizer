chrome.storage.sync.get('categorizedBookmarks', function(data) {
    var categorizedBookmarks = data.categorizedBookmarks;
    // Update the Excel sheet with the categorized bookmarks
    updateExcelSheet(categorizedBookmarks);
  });
  
  function updateExcelSheet(categorizedBookmarks) {
    function updateExcelSheet(categorizedBookmarks) {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(categorizedBookmarks);
      
        XLSX.utils.book_append_sheet(wb, ws, "Bookmarks");
      
        var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      
        function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
          return buf;
        }
      
        var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        var url = URL.createObjectURL(blob);
      
        // Trigger the download of the Excel file
        var a = document.createElement("a");
        a.href = url;
        a.download = "bookmarks.xlsx";
        a.click();
      }
    }