$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"').attr("content"),
    },
});

$(document).ready(function () {
    const dataTable = $("#todo-table").DataTable();

    $("#create-todo-btn").click(function () {
        $("#todo-modal #title").val("");
        $("#todo-modal #description").val("");
        $("#todo-form input, #todo-form textarea").removeAttr("disabled");
        $("#todo-form button[type=submit]").removeClass("d-none");
        $("#modal-title").text("Create Todo");
        $("#todo-form").attr("action", `${baseUrl}/todos`);
        $("#hidden-todo-id").remove();
        $("#todo-modal").modal("toggle");
    });

    $("#todo-form").validate({
        rules: {
            title: {
                required: true,
                minlength: 3,
                maxlength: 50,
            },
            description: {
                required: true,
                minlength: 10,
                maxlength: 255,
            },
        },
        messages: {
            title: {
                required: "Please enter todo title",
                minlength: "Todo title must be atleast 3 chars.",
                maxlength: "Todo title must not be greater than 50 chars",
            },
            description: {
                required: "Please enter todo description",
                minlength: "Todo description must be atleast 10 chars.",
                maxlength:
                    "Todo description must not be greater than 255 chars",
            },
        },
        submitHandler: function (form) {
            const formData = $(form).serializeArray();
            const todoId = $("#hidden-todo-id").val();

            const methodType = (todoId && "PUT") || "POST";
            const formAction = $(form).attr("action");

            $.ajax({
                url: formAction,
                type: methodType,
                data: formData,
                beforeSend: function () {
                    console.log("Loading...");
                },
                success: function (response) {
                    $("#todo-form")[0].reset();
                    $("#todo-modal").modal("toggle");

                    if (response.status === "success") {
                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: response.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        // For update
                        if (todoId) {
                            $(`#todo_${todoId} td:nth-child(3)`).html( response.todo.title );
                            $(`#todo_${todoId} td:nth-child(4)`).html( response.todo.description );
                        }

                        // Create
                        else {
                            const newTodoRow =
                                `<tr id="todo_${response.todo.id}">
                                    <td><input type="checkbox" class="form-check-input todo-checkbox" value="${response.todo.id}" /></td>
                                    <td>${response.todo.id}</td>
                                    <td>${response.todo.title}</td>
                                    <td>${response.todo.description}</td>
                                    <td>${response.todo.is_completed ? "Yes" : "No"}</td>
                                    <td>
                                        <a class="btn btn-info btn-sm btn-view" href="javascript:void(0)" data-id="${ response.todo.id }">View</a>
                                        <a class="btn btn-success btn-sm btn-edit" href="javascript:void(0)" data-id="${ response.todo.id }">Edit</a>
                                        <a class="btn btn-danger btn-sm btn-delete" href="javascript:void(0)" data-id="${ response.todo.id }">Delete</a>
                                    </td>
                                </tr>`;

                            dataTable.row.add($(newTodoRow)).draw(false);
                        }
                    } else if (response.status === "failed") {
                        Swal.fire({
                            icon: "error",
                            title: "Failed!",
                            text: response.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                },
                error: function (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: response.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                },
            });
        },
    });

    // View Todo
    $("#todo-table").on("click", ".btn-view", function () {
        const todoId = $(this).data("id");
        const mode = "view";
        todoId && fetchTodo(todoId, mode);
    });

    function fetchTodo(todoId, mode = null) {
        if (todoId) {
            $.ajax({
                url: `todos/${todoId}`,
                type: "GET",
                success: function (response) {
                    if (response.status === "success") {
                        const todo = response.todo;

                        $("#todo-modal #title").val(todo.title);
                        $("#todo-modal #description").val(todo.description);

                        if (mode === "view") {
                            $("#todo-form input, #todo-form textarea").attr("disabled", true);
                            $("#todo-form button[type=submit]").addClass("d-none");
                            $("#modal-title").text("Todo Detail");
                            $("#todo-form").removeAttr("action");
                            $("#hidden-todo-id").remove();
                        } else if (mode === "edit") {
                            $("#todo-form input, #todo-form textarea").removeAttr("disabled");
                            $("#todo-form button[type=submit]").removeClass("d-none");
                            $("#modal-title").text("Update Todo");
                            $("#todo-form").attr("action", `${baseUrl}/todos/${todo.id}`);
                            $("#todo-form").append(`<input type="hidden" id="hidden-todo-id" value="${todo.id}"/>`);
                        }

                        $("#todo-modal").modal("toggle");
                    }
                },
                error: function (error) {
                    console.error(error);
                },
            });
        }
    }

    // Edit todo
    $("#todo-table").on("click", ".btn-edit", function () {
        const todoId = $(this).data("id");
        const mode = "edit";
        todoId && fetchTodo(todoId, mode);
    });

    // Delete functionality
    $("#todo-table tbody").on("click", ".btn-delete", function () {
        const todoId = $(this).data("id");
        const buttonObj = $(this);

        if (todoId) {
            // sweetalert

            Swal.fire({
                title: "Are you sure?",
                text: "Once deleted, You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Delete",
            }).then((result) => {
                if (result.isConfirmed) {
                    // ajax call
                    $.ajax({
                        url: `todos/${todoId}`,
                        type: "DELETE",
                        success: function (response) {
                            if (response.status === "success") {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Todo has been deleted.",
                                    icon: "success",
                                    timer: 1500,
                                });

                                if (response.todo) {
                                    $(`#todo_${response.todo.id}`).remove();
                                }
                            } else {
                                Swal.fire({
                                    title: "Failed!",
                                    text: "Unable to delete Todo!",
                                    icon: "error",
                                });
                            }
                        },
                        error: function (error) {
                            Swal.fire({
                                title: "Failed!",
                                text: "Unable to delete Todo!",
                                icon: "error",
                            });
                        },
                    });
                }
            });
        }
    });

    // Select all functionality
    $("#select-all").on("click", function() {
        const checkboxes = $("tbody input[type='checkbox']");
        checkboxes.prop("checked", $(this).prop("checked"));

        if ($(this).prop("checked")) {
            $("#mark-completed-btn").removeClass("d-none");
            $("#bulk-delete-btn").removeClass("d-none");
        }
        else {
            $("#mark-completed-btn").addClass("d-none");
            $("#bulk-delete-btn").addClass("d-none");
        }
    });

    // Single select checkbox
    $("#todo-table tbody").on("click", ".todo-checkbox", function() {
        const checkbox = $(this).find('input[type="checkbox"]');
        checkbox.prop("checked", !checkbox.prop("checked"));

        const totalCheckboxes = $("tbody input[type='checkbox']").length;
        const totalSelectedCheckboxes = $(".todo-checkbox:checked").length;

        if (totalCheckboxes != totalSelectedCheckboxes) {
            $("#select-all").prop("checked", false);
        }
        else {
            $("#select-all").prop("checked", true);
        }
        if ($(".todo-checkbox:checked").length > 0) {
            $("#mark-completed-btn").removeClass("d-none");
            $("#bulk-delete-btn").removeClass("d-none");
        }
        else {
            $("#mark-completed-btn").addClass("d-none");
            $("#bulk-delete-btn").addClass("d-none");
        }
    });


    // Mark as completed todo
    $("#mark-completed-btn").on("click", function() {
        let selectedTodos = [];

        $(".todo-checkbox:checked").each(function() {
            selectedTodos.push($(this).val());
        });

        if (selectedTodos.length > 0) {
            $.ajax({
                url: "todos/mark-completed",
                type: "POST",
                data: {
                    todoIds: selectedTodos
                },
                success: function(response) {
                   if (response.status === "success") {
                        const todos = response.todos;

                        $.each(todos, function(index, todo) {
                            $(`#todo_${todo.id} td:nth-child(5)`).html( todo.is_completed ? 'Yes' : 'No' );
                        });

                        Swal.fire({
                            title: "Updated!",
                            text: "Todo has been marked as completed.",
                            icon: "success",
                            timer: 1500,
                        });
                   }

                   else {
                    Swal.fire({
                        title: "Failed!",
                        text: "Unable to mark as completed.",
                        icon: "error",
                        timer: 1500,
                    });
                   }
                },
                error: function(error) {
                    Swal.fire({
                        title: "Failed!",
                        text: "Something went wrong!.",
                        icon: "error",
                        timer: 1500,
                    });
                }
            });
        }
    });

    // Bulk delete function
    $("#bulk-delete-btn").on("click", function() {
        let selectedTodos = [];

        $(".todo-checkbox:checked").each(function() {
            selectedTodos.push($(this).val());
        });

        $.ajax({
            url: "todos/bulk-delete",
            type: "POST",
            data: {
                todoIds: selectedTodos
            },
            success: function(response) {
                if (response.status === "success") {

                    $(".todo-checkbox:checked").each(function() {
                        dataTable.row($(this).parents('tr')).remove().draw();
                    });

                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success",
                        timer: 1500,
                    });

                    $("#mark-completed-btn").addClass("d-none");
                    $("#bulk-delete-btn").addClass("d-none");
                }
                else {
                    Swal.fire({
                        title: "Failed!",
                        text: response.message,
                        icon: "error",
                        timer: 1500,
                    });
                }
            },
            error: function(error) {
                Swal.fire({
                    title: "Failed!",
                    text: "Unable to delete todos.",
                    icon: "error",
                    timer: 1500,
                });
            }
        })
    });
});
