namespace WorkshopTracker.API.DTOs;

public class PresencaCreateDto
{
    public int WorkshopId {get; set;}
    public int ColaboradorId {get; set;}
}

public class PresencaResponseDto
{
    public int Id {get; set;}
    public int WorkshopId {get; set;}
    public string WorkshopNome {get; set;} = string.Empty;
    public int ColaboradorId {get; set;}
    public string ColaboradorNome {get; set;} = string.Empty;
    public DateTime DataRegistro {get; set;}
}