@extends('layouts.app')
@section('content')
@include('todos.subview.create')

<div class="container py-5">
    <h3 class="text-center fw-bold"> Ajax CRUD in Laravel 10 - Programming Fields</h3>
    <div class="row border-top pt-2">
        <div class="col-xl-6">
            <a href="javascript:void(0)" id="mark-completed-btn" class="btn btn-success d-none"> Mark as Completed </a>
            <a href="javascript:void(0)" id="bulk-delete-btn" class="btn btn-danger d-none"> Delete </a>
        </div>
        <div class="col-xl-6 text-end">
            <a href="javascript:void(0)" id="create-todo-btn" class="btn btn-primary"> Create Todo </a>
        </div>
    </div>

    <div class="table-responsive pt-4">
        <table class="table table-striped" id="todo-table">
            <thead>
                <tr>
                    <th data-orderable="false" class="no-sort"><input type="checkbox" id="select-all" class="form-check-input" /></th>
                    <th>Id </th>
                    <th>Title </th>
                    <th>Description </th>
                    <th>Completed </th>
                    <th>Action </th>
                </tr>
            </thead>

            <tbody>
                @foreach ($todos as $todo)
                    <tr id="{{'todo_'.$todo->id}}">
                        <td><input type="checkbox" class="form-check-input todo-checkbox" value="{{$todo->id}}" /></td>
                        <td>{{$todo->id}}</td>
                        <td>{{$todo->title}}</td>
                        <td>{{$todo->description}}</td>
                        <td>{{$todo->is_completed ? 'Yes' : 'No'}}</td>
                        <td>
                            <a class="btn btn-info btn-sm btn-view" href="javascript:void(0)" data-id="{{$todo->id}}">View</a>
                            <a class="btn btn-success btn-sm btn-edit" href="javascript:void(0)" data-id="{{$todo->id}}">Edit</a>
                            <a class="btn btn-danger btn-sm btn-delete" href="javascript:void(0)" data-id="{{$todo->id}}">Delete</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection
