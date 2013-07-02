
# Sys.setlocale('LC_ALL','C') 

shinyServer(function(input, output) {
  output$contents <- renderTable({
    
    inFile <- input$file1
    
    if (is.null(inFile))
      return(NULL)
    
    tempTable<-read.csv(inFile$datapath, skip=input$toplines, header=input$header, na.strings=c("NA",input$nas), sep=input$sep, quote=input$quote)
    out <- as.data.frame(sapply(tempTable,gsub,pattern="µ",replacement="u"))
    out
  })
  
  output$transformedContents <- renderTable({
    
    inFile <- input$file1
    
    if (is.null(inFile))
      return(NULL)
    
    tempRotate<-t(read.csv(inFile$datapath, skip=input$toplines, header=input$header, na.strings=c("NA",input$nas), sep=input$sep, quote=input$quote))
    ans <- as.data.frame(sapply(tempRotate,gsub,pattern="µ",replacement="u"))
    as.data.frame(ans)
    
  })
  
})