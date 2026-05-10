<form method="POST" enctype="multipart/form-data">

    @csrf

    <input type="text" name="student_name" placeholder="Student Name">

    <input type="text" name="certificate_name" placeholder="Certificate Name">

    <input type="file" name="certificate">

    <button type="submit">
        Upload
    </button>

</form>