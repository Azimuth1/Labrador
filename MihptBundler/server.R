
# Sys.setlocale('LC_ALL','C') 

library(plyr)

shinyServer(function(input, output) {
  output$contents <- renderTable({
    
    inFile <- input$files[[1, 'datapath']]
    
    if (is.null(inFile))
      return(NULL)
    
    tempTable<-read.csv(inFile, skip=input$toplines, header=input$header, sep=input$sep, na.strings=c("NA",input$nas),quote=input$quote)
    #out <- as.data.frame(sapply(tempTable,gsub,pattern="µ",replacement="u"))
    tempTable
  })
  
  output$transformedContents <- renderTable({
    prepMihpt<-function(x){
      
      
      
    }

    full_data <- ldply(input$files[,'datapath'], read.table, header=input$header, sep=input$sep)
    full_data
    
  })
    
})