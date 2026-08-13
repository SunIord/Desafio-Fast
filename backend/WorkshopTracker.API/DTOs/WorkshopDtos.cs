namespace WorkshopTracker.API.DTOs;

public class WorkshopCreateDto
{
    public string Nome {get; set;} = string.Empty;
    public DateTime DataRealizacao {get; set;}
    public string Descricao {get; set;} = string.Empty;
}

public class WorkshopUpdateDto
{
    public string Nome {get; set;} = string.Empty;
    public DateTime DataRealizacao {get; set;}
    public string Descricao {get; set;} = string.Empty;
}

public class WorkshopResponseDto
{
    public int Id {get; set;}
    public string Nome {get; set;} = string.Empty;
    public DateTime DataRealizacao {get; set;}
    public string Descricao {get; set;} = string.Empty;
} 

public class WorkshopDetailDto : WorkshopResponseDto
{
    public List<ColaboradorPresenteDto> ColaboradoresPresentes {get; set;} = new();
}

public class ColaboradorPresenteDto
{
    public int Id {get; set;}
    public string Nome {get; set;} = string.Empty;
}