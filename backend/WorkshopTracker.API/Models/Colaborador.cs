namespace WorkshopTracker.API.Models;

public class Colaborador 
{
    public int Id {get; set;}
    public string Nome {get; set;} = string.Empty; // garante que nunca seja null

    // lista de presença, referente ao relacionamento decido no documento do models
    public ICollection<Presenca> Presencas { get; set; } = new List<Presenca>();
}