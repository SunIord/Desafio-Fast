namespace WorkshopTracker.API.Models;

public class Presenca
{
    public int Id {get; set;}
    
    public int WorkshopId {get; set;}
    public Workshop Workshop {get; set;} = null!; // referência não nula (na prática)

    public int ColaboradorId {get; set;}
    public Colaborador Colaborador {get; set;} = null!;

    public DateTime DataRegistro {get; set;} = DateTime.UtcNow; // registra data atual em UTC, será convertido posteriormente
}