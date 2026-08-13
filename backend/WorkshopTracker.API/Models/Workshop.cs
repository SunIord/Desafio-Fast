namespace WorkshopTracker.API.Models;

public class Workshop 
{
    public int Id {get; set;}
    public string Nome {get; set;} = string.Empty;
    public DateTime DataRealizacao {get; set;}
    public string Descricao {get; set;} = string.Empty;
    
    public ICollection<Presenca> Presencas { get; set; } = new List<Presenca>();
}