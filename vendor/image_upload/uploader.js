(function($) {
  $.fn.extend({
    "initUpload": function (options) {
      var config = {
        multipleFiles: false,
        iscrop: false,                  // 是否切图
        autoRemoveCompleted: true,      // 是否自动删除容器中已上传完毕的文件, 默认: false
        maxSize: 2097152,              // 单个文件的最大大小，默认:2G
        tokenURL: "/UploadRoot/UploadFile.aspx?action=gettoken",            // 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌）
        frmUploadURL: "/UploadRoot/upload.php?action=fd;",                  // Flash上传的URI
        uploadURL: "/UploadRoot/UploadFile.aspx?action=upext",              // HTML5上传的URI */
        /**
         * 点击上传按钮时的相应方法
         */
        onSelect: function (list) {
          options.select && options.select(list);
        },

        /**
         * 文件超过上限时的处理方法
         * @param {number} size 实际大小
         * @param {number} limited 限制大小
         * @param {string} name 文件名
         */
        onMaxSizeExceed: function (size, limited, name) {
          options.maxSizeExceed && options.maxSizeExceed(size, limited, name);
        },

        /**
         * 上传完成后的处理方法
         * @param {object} file 完成的文件
         */
        onComplete: function (file) {
          options.complete && options.complete(file);
        },

        /**
         * 文件数超出上限处理
         * @param {Array} selected 选择的文件列表
         * @param {number} limit 上限数
         */
        onFileCountExceed: function (selected, limit) {
          options.fileCountExceed && options.fileCountExceed(selected, limit);
        },

        /**
         * 处理上传进度的方法
         * @param {number} e 当前上传进度
         */
        onUploadProgress: function (e) {
          // 有回调
          if (options.progress instanceof Function) {
            options.progress(e);
          }
        },

        /**
         * 处理全部取消上传的方法
         * @param {Array} members 取消列表
         */
        onCancelAll: function (members) {
          options.cancelAll && options.cancelAll(members)
        },

        /**
         * 处理单个取消上传的方法
         * @param {object} file 取消的文件
         */
        onCancel: function (file) {
          options.cancel && options.cancel(file);
        },

        /**
         * 处理上传错误
         * @param {string} status 状态
         * @param {string} msg 消息
         */
        onUploadError: function (status, msg) {
          options.error && options.error(status, msg);
        },

        /**
         * 处理队列完成
         * @param {string} msg 消息
         */
        onQueueComplete: function (msg) {
          options.queueComplete && options.queueComplete(msg);
        },

        /**
         * 处理添加任务
         * @param {object} file 添加的文件
         * @param {object} dat
         */
        onAddTask: function (file, dat) {
          options.addTask && options.addTask(file, dat);
        }

      };
      var strHtml = "";
      strHtml += "<div class='panelext'>";
      strHtml += "<div class='closebtnext'>";
      strHtml += "<div onclick='$(\"this\").CloseUpload()'></div>";
      strHtml += "</div>";
      strHtml += "<div>";
      strHtml += "<div class='uploadpaneel'>";
      strHtml += "<div id='i_select_files'>";
      strHtml += "</div>";
      strHtml += "<div id='i_stream_files_queue'>";
      strHtml += "</div>";
      strHtml += "<button class='custombtn' onclick='javascript:_t.upload();'>开始上传</button><button onclick='javascript:_t.cancel();' class='custombtn'>取消</button>";
      strHtml += "<div id='i_stream_message_container' class='stream-main-upload-box none' style='overflow: auto;height:200px;'>";
      strHtml += "</div>";
      strHtml += "</div>";
      strHtml += "</div>";
      strHtml += "</div>";
      $(".panelext").remove();
      $("#image-upload").append(strHtml);

      /**
       * 配置文件（如果没有默认字样，说明默认值就是注释下的值）
       * 但是，on*（onSelect， onMaxSizeExceed...）等函数的默认行为
       * 是在ID为i_stream_message_container的页面元素中写日志
       */
      config = $.extend(config, options);
      var _t = new Stream(config);
      return _t;
    }
  });
})(jQuery);
