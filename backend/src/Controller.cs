using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace ApiThf;

public abstract class Controller<T, TData>: ControllerBase where T : Repository<TData> where TData : class
{
    protected readonly T repository;

    public Controller(T repository)
    {
        this.repository = repository;
    }

}