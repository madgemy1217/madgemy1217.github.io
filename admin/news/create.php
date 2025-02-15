<?php 
session_start();

if (!isset($_SESSION['auth']) || !$_SESSION['auth']) {
    header('Location: ./../login.php');
}
?>
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AdminLTE 3 | Dashboard</title>
  <!-- Select2 -->
  <link rel="stylesheet" href="./../adminLTE/plugins/select2/css/select2.min.css">

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="./../adminLTE/plugins/fontawesome-free/css/all.min.css">
  <!-- daterange picker -->
  <link rel="stylesheet" href="./../adminLTE/plugins/daterangepicker/daterangepicker.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="./../adminLTE/dist/css/adminlte.min.css">
  <!-- overlayScrollbars -->
  <link rel="stylesheet" href="./../adminLTE/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
  <!-- summernote -->
  <link rel="stylesheet" href="./../adminLTE/plugins/summernote/summernote-bs4.min.css">
  <!-- dropzonejs -->
  <link rel="stylesheet" href="./../adminLTE/plugins/dropzone/min/dropzone.min.css">
</head>
<body class="hold-transition sidebar-mini layout-fixed">
<div class="wrapper">

  <!-- Preloader -->
  <div class="preloader flex-column justify-content-center align-items-center">
    <p class="animation__shake">Admin panel</p>
  </div>

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <!-- Messages Dropdown Menu -->
      <li class="nav-item dropdown">
        <a href="./../logout.php">
            <i class="fas fa-sign-out-alt"></i>
        </a>   
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" class="dropdown-item">
            <!-- Message Start -->
            <div class="media">
              {{-- <img src="dist/img/user1-128x128.jpg" alt="User Avatar" class="img-size-50 mr-3 img-circle"> --}}
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  Brad Diesel
                  <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">Call me whenever you can...</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
            <!-- Message End -->
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <!-- Message Start -->
            <div class="media">
              {{-- <img src="dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3"> --}}
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  John Pierce
                  <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">I got your message bro</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
            <!-- Message End -->
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <!-- Message Start -->
            <div class="media">
              {{-- <img src="dist/img/user3-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3"> --}}
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  Nora Silvester
                  <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">The subject goes here</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
            <!-- Message End -->
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
        </div>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->

  <?php include './../layout/aside.php' ?>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
<div>
    <!-- Content Header (Page header) -->
    <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">Добавить новость</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <!-- Small boxes (Stat box) -->
          <div class="row">
            <div class="col-12">
                <form action="./store.php" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <input type="text" name="title" placeholder="Заголовок" class="form-control" required>
                    </div>
                    <?php 
                        if (isset($_SESSION['errors']['title'])) {
                    ?>
                        <p class="text-danger"><?php echo $_SESSION['errors']['title']; ?></p>
                    <?php } ?>
                    <div class="mb-3">
                      <div class="card card-default">
                          <div class="card-body">
                              <div id="actions" class="row">
                                  <div class="col-lg-6">
                                  <div class="btn-group w-100">
                                      <span class="btn btn-success col fileinput-button">
                                      <i class="fas fa-plus"></i>
                                      <span>Добавить логотип</span>
                                      </span>
                                  </div>
                                  </div>
                                  <div class="col-lg-6 d-flex align-items-center">
                                  <div class="fileupload-process w-100">
                                      <div id="total-progress" class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                                      <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
                                      </div>
                                  </div>
                                  </div>
                              </div>
                              <div class="table table-striped files" id="previews">
                                  <div id="template" class="row mt-2">
                                  <div class="col-auto">
                                      <span class="preview"><img src="data:," alt="" data-dz-thumbnail /></span>
                                  </div>
                                  <div class="col d-flex align-items-center">
                                      <p class="mb-0">
                                          <span class="lead" data-dz-name></span>
                                          (<span data-dz-size></span>)
                                      </p>
                                      <strong class="error text-danger" data-dz-errormessage></strong>
                                  </div>
                                  <div class="col-4 d-flex align-items-center">
                                      <div class="progress progress-striped active w-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                                          <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
                                      </div>
                                  </div>
                                  <div class="col-auto d-flex align-items-center">
                                      <div class="btn-group">
                                      <button data-dz-remove class="btn btn-danger delete">
                                          <i class="fas fa-trash"></i>
                                          <span>Удалить</span>
                                      </button>
                                      </div>
                                  </div>
                                  </div>
                              </div>
                              </div>
                            </div>
                  </div>

                  <input type="file" name="image" id="input-file" class="d-none">
                    <?php 
                        if (isset($_SESSION['errors']['image'])) {
                    ?>
                        <p class="text-danger"><?php echo $_SESSION['errors']['image']; ?></p>
                    <?php } ?>
                    <div class="form-group">
                        <textarea type="text" name="content" placeholder="Контент" class="form-control" required></textarea>
                    </div>
                    <?php 
                        if (isset($_SESSION['errors']['content'])) {
                    ?>
                        <p class="text-danger"><?php echo $_SESSION['errors']['content']; ?></p>
                    <?php } ?>
                    <div class="form-group">
                        <input type="date" name="date" class="form-control" required>
                    </div>
                    <?php 
                        if (isset($_SESSION['errors']['date'])) {
                    ?>
                        <p class="text-danger"><?php echo $_SESSION['errors']['date']; ?></p>
                    <?php } ?>
                    <div class="form-group">
                        <button class="btn btn-primary" type="submit">Добавить</button>
                    </div>
                </form>             
            </div>

          </div>
          <!-- /.row -->

          <!-- /.row (main row) -->
        </div><!-- /.container-fluid -->
      </section>
      <!-- /.content -->
<div>
</div>
  <!-- /.content-wrapper -->


  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
  </aside>
  <!-- /.control-sidebar -->
</div>

<!-- ./wrapper -->

<!-- jQuery -->
<script src="./../adminLTE/plugins/jquery/jquery.min.js"></script>
<!-- jQuery UI 1.11.4 -->
<script src="./../adminLTE/plugins/jquery-ui/jquery-ui.min.js"></script>
<!-- dropzonejs -->
<script src="./../adminLTE/plugins/dropzone/min/dropzone.min.js"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
  $.widget.bridge('uibutton', $.ui.button)
</script>
<!-- Bootstrap 4 -->
<script src="./../adminLTE/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Summernote -->
<script src="./../adminLTE/plugins/summernote/summernote-bs4.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/lang/summernote-ru-RU.js"></script>
<!-- overlayScrollbars -->
<script src="./../adminLTE/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<!-- AdminLTE App -->
<script src="./../adminLTE/dist/js/adminlte.js"></script>
<!-- Select2 -->
<script src="./../adminLTE/plugins/select2/js/select2.full.min.js"></script>
<!-- InputMask -->
<script src="./../adminLTE/plugins/moment/moment.min.js"></script>
<script src="./../adminLTE//plugins/inputmask/jquery.inputmask.min.js"></script>
<!-- date-range-picker -->
<script src="./../adminLTE/plugins/daterangepicker/daterangepicker.js"></script>

<script>
// DropzoneJS startg

$(document).ready(function() {
    function putFileToInput(file) {
        const $inputFile = document.querySelector('#input-file')
        let dt  = new DataTransfer();
        dt.items.add(file);
        let file_list = dt.files;

        $inputFile.files = file_list;
    }
    // DropzoneJS Demo Code Start
    Dropzone.autoDiscover = false;

    // Get the template HTML and remove it from the document
    let previewNode = document.querySelector("#template");
    previewNode.id = "";
    let previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    let myDropzone = new Dropzone(document.body, {
        // Make the whole body a dropzone
        url: "/target-url", // Set the URL
        thumbnailWidth: 250,
        thumbnailHeight: 250,
        parallelUploads: 1,
        acceptedFiles: 'image/*',
        uploadMultiple: false,
        maxFiles: 1,
        previewTemplate: previewTemplate,
        autoQueue: false, // Make sure the files aren't queued until manually added
        previewsContainer: "#previews", // Define the container to display the previews
        clickable: ".fileinput-button", // Define the element that should be used as click trigger to select files.

        // Translate Dropzone into Russian
        dictDefaultMessage: "Перетащите файлы для загрузки в это поле",
        dictFallbackMessage: "К сожалению, ваш браузер не поддерживает Drag'n'Drop",
        dictFallbackText: "Пожалуйста, воспользуйтесь старой доброй формой для загрузки",
        dictFileTooBig: "Файл слишком большой.",
        dictInvalidFileType: "Вы не можете загружать файлы этого типа",
        dictResponseError: "Произошла ошибка при загрузке файла. Попробуйте еще раз. Если ошибка будет повторяться - передайте эту информацию администратору сайта: Код ошибки",
        dictCancelUpload: "Отменить загрузку",
        dictCancelUploadConfirmation: "Уверены, что хотите прервать загрузку?",
        dictRemoveFile: "Удалить файл",
        dictRemoveFileConfirmation: null,
        dictMaxFilesExceeded: "Превышен лимит количества файлов. Вы можете загрузить не более 1",
    });

    myDropzone.on("addedfile", function(file) {
        putFileToInput(file)
    });

    // Update the total progress bar
    myDropzone.on("totaluploadprogress", function(progress) {
        document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
    });

    myDropzone.on("sending", function(file) {
        // Show the total progress bar when upload starts
        document.querySelector("#total-progress").style.opacity = "1";
        // And disable the start button
        file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
    });

    // Hide the total progress bar when nothing's uploading anymore
    myDropzone.on("queuecomplete", function(progress) {
        document.querySelector("#total-progress").style.opacity = "0";
    });

    // Exception handling
    myDropzone.on("error", function(file, errorMessage, xhr) {
      if (errorMessage === myDropzone.options.dictMaxFilesExceeded) {
        myDropzone.files = myDropzone.files.filter(file => file.status === 'added')

        putFileToInput(myDropzone.files[0])
      }
    });
});

// DropzoneJS End
</script>
</body>
</html>

<?php unset($_SESSION['errors']) ?>